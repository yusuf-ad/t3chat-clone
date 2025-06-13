"use server";

import { loadChat, saveChat } from "@/lib/chat-store";
import { attempt } from "@/lib/try-catch";

import type { UIMessage } from "ai";
import { db } from "../db";
import { chat } from "../db/schema";
import { eq } from "drizzle-orm";
import { ChatSDKError } from "@/lib/errors";

export type Message = Omit<UIMessage, "content">;

export async function storePausedMessages({
  id,
  questionMessage,
  responseMessage,
}: {
  id: string;
  questionMessage: Message;
  responseMessage: Message;
}) {
  const [data, error] = await attempt(async () => {
    const previousMessages = await loadChat(id);

    await saveChat({
      id,
      messages: [
        ...previousMessages,
        {
          ...questionMessage,
        },
        {
          ...responseMessage,
        },
      ],
    });

    return {
      status: "success",
      message: "Chat updated successfully",
    };
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  } else {
    return data;
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
