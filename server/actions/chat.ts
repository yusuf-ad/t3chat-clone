"use server";

import { loadChat, saveChat } from "@/lib/chat-store";
import { attempt } from "@/lib/try-catch";
import { DBMessage } from "@/schema";

export async function storePausedMessages({
  id,
  questionMessage,
  responseMessage,
}: {
  id: string;
  questionMessage: DBMessage;
  responseMessage: DBMessage;
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
