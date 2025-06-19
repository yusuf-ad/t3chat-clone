import { ChatSDKError } from "@/lib/errors";
import { attempt } from "@/lib/try-catch";
import { generateUUID, getTrailingMessageId } from "@/lib/utils";
import { createChat, getChatById } from "@/server/actions/chat";
import {
  generateTitleFromUserMessage,
  getMessagesByChatId,
  saveMessages,
} from "@/server/actions/message";
import { getLanguageModel, DEFAULT_MODEL } from "@/lib/ai/ai-providers";
import { auth } from "@clerk/nextjs/server";
import {
  APICallError,
  appendClientMessage,
  appendResponseMessages,
  NoSuchProviderError,
  streamText,
} from "ai";
import { NextResponse } from "next/server";
import { RequestHints, systemPrompt } from "@/lib/ai/prompts";
import { geolocation } from "@vercel/functions";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // get the last message from the client:

  const { message, id, model, apiKeys } = await req.json();

  try {
    const { userId } = await auth();

    if (!userId) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const [chat, chatError] = await attempt(getChatById({ id }));

    if (chatError) {
      console.error("💥 Error in chat route", chatError);
    }

    if (!chat) {
      const selectedModel = model || DEFAULT_MODEL;
      const title = await generateTitleFromUserMessage({
        message,
        apiKeys,
        model: selectedModel,
      });

      await createChat({
        id,
        userId,
        title,
      });
    } else {
      if (chat.userId !== userId) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    }

    // load the previous messages from the server:
    const previousMessages = await getMessagesByChatId({ id });

    // append the new message to the previous messages:
    const messages = appendClientMessage({
      // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
      messages: previousMessages,
      message,
    });

    const { longitude, latitude, city, country } = geolocation(req);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
      time: new Date().toLocaleString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const [, saveMessagesError] = await attempt(async () => {
      return await saveMessages({
        messages: [
          {
            chatId: id,
            id: message.id,
            role: "user",
            parts: message.parts,
            annotations: [],
            createdAt: new Date(),
          },
        ],
      });
    });

    if (saveMessagesError) {
      console.error("💥 Error in chat route", saveMessagesError);
    }

    const selectedModel = model || DEFAULT_MODEL;
    const languageModel = getLanguageModel(selectedModel, apiKeys);

    let errorMessage = {
      error: "An unexpected error occurred. Please try again later.",
      status: 500,
    };

    const result = streamText({
      model: languageModel,
      messages,
      system: systemPrompt({ requestHints }),
      abortSignal: req.signal,
      experimental_generateMessageId: generateUUID,

      async onError({ error }) {
        if (error instanceof APICallError) {
          errorMessage = {
            error: error.message,
            status: error.statusCode || 500,
          };
        }

        if (error instanceof Error) {
          // use this function to save the messages that are immediately stopped by the user
          if (error.name === "ResponseAborted") {
            const [, saveMessagesError] = await attempt(async () => {
              return await saveMessages({
                messages: [
                  {
                    chatId: id,
                    id: generateUUID(),
                    role: "assistant",
                    parts: [
                      {
                        type: "text",
                        text: "",
                      },
                    ],
                    annotations: [
                      {
                        hasStopped: true,
                        modelId: languageModel.modelId,
                      },
                    ],
                    createdAt: new Date(),
                  },
                ],
              });
            });

            if (saveMessagesError) {
              throw new ChatSDKError(
                "bad_request:database",
                "Failed to save messages",
              );
            }
          }
        }
      },

      async onFinish({ response }) {
        if (userId) {
          try {
            const assistantId = getTrailingMessageId({
              messages: response.messages.filter(
                (message) => message.role === "assistant",
              ),
            });

            if (!assistantId) {
              throw new Error("No assistant message found!");
            }

            const [, assistantMessage] = appendResponseMessages({
              messages: [message],
              responseMessages: response.messages,
            });

            await saveMessages({
              messages: [
                {
                  id: generateUUID(),
                  chatId: id,
                  role: assistantMessage.role,
                  parts: assistantMessage.parts,
                  annotations: [
                    {
                      modelId: languageModel.modelId,
                    },
                  ],
                  createdAt: new Date(),
                },
              ],
            });
          } catch (error) {
            console.error("💥 Error in chat route", error);
          }
        }
      },
    });

    // consume the stream to ensure it runs to completion & triggers onFinish
    // even when the client response is aborted:
    result.consumeStream(); // no await

    return result.toDataStreamResponse({
      getErrorMessage() {
        return errorMessage.error + "-" + errorMessage.status;
      },
    });
  } catch (error) {
    if (error instanceof APICallError) {
      return NextResponse.json(
        {
          error: error.message,
          status: error.statusCode,
        },
        { status: error.statusCode },
      );
    }

    if (error instanceof NoSuchProviderError) {
      return NextResponse.json(
        {
          error: "No such provider. Please check your API keys.",
          status: 400,
        },
        { status: 400 },
      );
    }

    if (error instanceof APICallError) {
      return NextResponse.json(
        {
          error: error.message,
          status: error.statusCode,
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again later.",
        status: 500,
      },
      { status: 500 },
    );
  }
}
