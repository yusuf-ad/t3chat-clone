import ChatInterface from "@/components/chat-interface";
import { PreviewChatInput } from "@/components/preview-chat-input";
import { loadChat } from "@/lib/chat-store";
import { attempt } from "@/lib/try-catch";
import { getChatById } from "@/server/actions/chat";
import { getMessagesByChatId } from "@/server/actions/message";
import { DBMessage } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { Attachment, UIMessage } from "ai";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col px-2 pt-14">
        <PreviewChatInput />
      </div>
    );
  }

  const { id } = await params;
  const chat = await getChatById({ id });

  if (!chat) {
    return <div>Chat not found</div>;
  }

  const [messagesFromDb, error] = await attempt(getMessagesByChatId({ id }));

  if (error) {
    return <div>Error loading messages</div>;
  }

  function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage["parts"],
      role: message.role as UIMessage["role"],
      // Note: content will soon be deprecated in @ai-sdk/react
      content: "",
      createdAt: message.createdAt,
      experimental_attachments:
        (message.attachments as Array<Attachment>) ?? [],
    }));
  }

  console.log("💥 messagesFromDb", messagesFromDb);

  return (
    <ChatInterface
      id={id}
      initialMessages={convertToUIMessages(messagesFromDb)}
    />
  );
}
