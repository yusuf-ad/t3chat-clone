"use server";

import { loadChat, saveChat } from "@/lib/chat-store";
import { attempt } from "@/lib/try-catch";
import { Message } from "ai";

export async function updateChat({
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
          id: responseMessage.id,
          role: "assistant",
          content: responseMessage.content,
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
