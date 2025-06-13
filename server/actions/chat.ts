"use server";

import { loadChat, saveChat } from "@/lib/chat-store";
import { attempt } from "@/lib/try-catch";

import type { UIMessage } from "ai";

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
