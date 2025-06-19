"use server";

import { generateText, UIMessage } from "ai";
import { db } from "../db";
import { DBMessage, message } from "../db/schema";
import { and, asc, eq, gt } from "drizzle-orm";
import { ChatSDKError } from "@/lib/errors";
import { attempt } from "@/lib/try-catch";
import { getLanguageModel } from "@/lib/ai/ai-providers";

export async function generateTitleFromUserMessage({
  message,
  apiKeys,
  model,
}: {
  message: UIMessage;
  apiKeys?: { openai?: string; openrouter?: string };
  model?: string;
}) {
  // Use the user's selected model for title generation if provided
  // This ensures consistency - same model for chat and title generation
  let modelId: string;

  if (model) {
    // User has selected a specific model, use that
    modelId = model;
  } else {
    // Fallback to smart selection if no model specified:
    // 1. If user has OpenRouter API key, use Claude 3.5 Sonnet
    // 2. If user has OpenAI API key, use GPT-4o Mini
    // 3. Otherwise fallback to Mistral (environment variables)
    if (apiKeys?.openrouter) {
      modelId = "openrouter:anthropic/claude-3.5-sonnet";
    } else if (apiKeys?.openai) {
      modelId = "openai:gpt-4o-mini";
    } else {
      modelId = "mistral:mistral-small-latest";
    }
  }

  const languageModel = getLanguageModel(modelId, apiKeys);

  const { text: title } = await generateText({
    model: languageModel,
    system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function getMessagesByChatId({ id }: { id: string }) {
  const [data, error] = await attempt(async () => {
    return db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  });

  if (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get messages");
  }

  return data;
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  const [, error] = await attempt(async () => {
    return db.insert(message).values(messages);
  });

  if (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }
}

export async function getMessageById({ id }: { id: string }) {
  const [data, error] = await attempt(async () => {
    return db.select().from(message).where(eq(message.id, id));
  });

  if (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get message");
  }

  return data;
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  const [, error] = await attempt(async () => {
    return db
      .delete(message)
      .where(and(eq(message.chatId, chatId), gt(message.createdAt, timestamp)));
  });

  if (error) {
    throw new ChatSDKError("bad_request:database", "Failed to delete messages");
  }
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}
