"use server";

import { attempt } from "@/lib/try-catch";

import type { UIMessage } from "ai";
import { db } from "../db";
import { chat } from "../db/schema";
import { eq } from "drizzle-orm";
import { ChatSDKError } from "@/lib/errors";
import { saveMessages } from "./message";
import { revalidateTag, unstable_cache } from "next/cache";

export type Message = Omit<UIMessage, "content">;

export async function storePausedMessages({
  id,
  responseMessage,
}: {
  id: string;
  responseMessage: Message;
}) {
  // use this function to save the messages that are paused
  // when the user stops the stream
  const [, error] = await attempt(
    saveMessages({
      messages: [
        {
          chatId: id,
          id: responseMessage.id,
          role: "assistant",
          parts: responseMessage.parts,
          annotations: [
            {
              hasStopped: true,
            },
          ],
          createdAt: responseMessage.createdAt ?? new Date(),
        },
      ],
    }),
  );

  if (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function createChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  const [data, error] = await attempt(async () =>
    db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
    }),
  );
  if (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }

  revalidateTag("chat-history");

  return data;
}

export async function getChatById({ id }: { id: string }) {
  const [selectedChat, error] = await attempt(async () => {
    const [chatRow] = await db.select().from(chat).where(eq(chat.id, id));
    return chatRow;
  });

  if (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }

  return selectedChat;
}

export const getChatHistory = unstable_cache(
  async function getChatHistory({ userId }: { userId: string }) {
    const [data, error] = await attempt(async () => {
      const chatHistory = await db
        .select()
        .from(chat)
        .where(eq(chat.userId, userId));

      return chatHistory;
    });

    if (error) {
      throw new ChatSDKError(
        "bad_request:database",
        "Failed to get chat history",
      );
    }

    return data;
  },
  ["userId"],
  {
    revalidate: 60 * 60,
    tags: ["chat-history"],
  },
);
