import { loadChat, saveChat } from "@/lib/chat-store";
import { ChatSDKError } from "@/lib/errors";
import { attempt } from "@/lib/try-catch";
import { generateUUID, getTrailingMessageId } from "@/lib/utils";
import { createChat, getChatById } from "@/server/actions/chat";
import {
  generateTitleFromUserMessage,
  getMessagesByChatId,
  saveMessages,
} from "@/server/actions/message";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { appendClientMessage, appendResponseMessages, streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `You are an AI assistant helping users with tasks like answering questions, brainstorming, drafting text, and coding. Follow these guidelines: 1) Be helpful and accurate - provide clear info, admit uncertainty. 2) Be polite and engaging - use friendly tone, match user's style. 3) Prioritize user intent - understand needs, ask if unclear. 4) Structure responses - use lists, format code properly. 5) Follow ethics - no harmful content, respect privacy. 6) Stay context-aware - track conversation, summarize when helpful. Format in Markdown.`;

export async function POST(req: Request) {
  // get the last message from the client:
  const { message, id } = await req.json();

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
      const title = await generateTitleFromUserMessage({
        message,
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
      console.error("💥 Error in chat route222", saveMessagesError);
    }

    const result = streamText({
      model: openai("gpt-3.5-turbo-16k"),
      messages,
      system: systemPrompt,
      abortSignal: req.signal,

      async onError({ error }) {
        console.log("💥 Error in chat route", error);
        if (error instanceof Error) {
          if (error.name === "ResponseAborted") {
            console.log("💥 AbortError in chat route");
          }
        }
      },

      async onFinish({ response }) {
        if (userId) {
          try {
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
                  annotations: [],
                  createdAt: new Date(),
                },
              ],
            });
          } catch (_) {
            console.error("Failed to save chat");
          }
        }
      },
    });

    // consume the stream to ensure it runs to completion & triggers onFinish
    // even when the client response is aborted:
    result.consumeStream(); // no await

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    );
  }
}
