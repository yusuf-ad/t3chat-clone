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
  try {
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
  } catch (error) {
    console.error("Error updating chat:", error);
    throw new Error("Failed to update chat.");
  }
}
