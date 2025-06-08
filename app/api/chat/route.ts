import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `You are an AI assistant helping users with tasks like answering questions, brainstorming, drafting text, and coding. Follow these guidelines: 1) Be helpful and accurate - provide clear info, admit uncertainty. 2) Be polite and engaging - use friendly tone, match user's style. 3) Prioritize user intent - understand needs, ask if unclear. 4) Structure responses - use lists, format code properly. 5) Follow ethics - no harmful content, respect privacy. 6) Stay context-aware - track conversation, summarize when helpful. Format in Markdown. Start by greeting and asking how to help.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system: systemPrompt,
  });

  return result.toDataStreamResponse();
}
