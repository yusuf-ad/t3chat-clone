import { loadChat, saveChat } from "@/lib/chat-store";
import { openai } from "@ai-sdk/openai";
import { appendClientMessage, appendResponseMessages, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `You are an AI assistant helping users with tasks like answering questions, brainstorming, drafting text, and coding. Follow these guidelines: 1) Be helpful and accurate - provide clear info, admit uncertainty. 2) Be polite and engaging - use friendly tone, match user's style. 3) Prioritize user intent - understand needs, ask if unclear. 4) Structure responses - use lists, format code properly. 5) Follow ethics - no harmful content, respect privacy. 6) Stay context-aware - track conversation, summarize when helpful. Format in Markdown.`;

export async function POST(req: Request) {
  // get the last message from the client:
  const { message, id } = await req.json();

  // load the previous messages from the server:
  const previousMessages = await loadChat(id);

  // append the new message to the previous messages:
  const messages = appendClientMessage({
    messages: previousMessages,
    message,
  });

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system: systemPrompt,

    async onFinish({ response }) {
      await saveChat({
        id,
        messages: appendResponseMessages({
          messages,
          responseMessages: response.messages,
        }),
      });
    },
  });

  // consume the stream to ensure it runs to completion & triggers onFinish
  // even when the client response is aborted:
  result.consumeStream(); // no await

  return result.toDataStreamResponse();
}
