"use server";

import { openai } from "@ai-sdk/openai";
import { generateText, UIMessage } from "ai";
import { db } from "../db";
import { DBMessage, message } from "../db/schema";
import { asc, eq } from "drizzle-orm";
import { ChatSDKError } from "@/lib/errors";
import { attempt } from "@/lib/try-catch";

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text: title } = await generateText({
    model: openai("gpt-4o-mini"),
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
