"use server";

import { loadChat, saveChat } from "@/lib/chat-store";
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
  const previousMessages = await loadChat(id);

  await saveChat({
    id,
    messages: [
      ...previousMessages,
      {
        ...questionMessage,
      },
      {
        id: responseMessage.id + "-stop",
        role: "assistant",
        content: responseMessage.content,
      },
    ],
  });
}
