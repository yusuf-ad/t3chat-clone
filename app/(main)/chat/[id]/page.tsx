import ChatInterface from "@/components/chat-interface";
import ErrorMessage from "@/components/error-message";
import { PreviewChatInput } from "@/components/preview-chat-input";
import { attempt } from "@/lib/try-catch";
import { getChatById } from "@/server/actions/chat";
import { getMessagesByChatId } from "@/server/actions/message";
import { DBMessage } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { UIMessage } from "ai";

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
  const [, chatError] = await attempt(getChatById({ id }));

  const [messagesFromDb, error] = await attempt(getMessagesByChatId({ id }));

  if (error || chatError) {
    return <ErrorMessage chatError={chatError} error={error} />;
  }

  function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage["parts"],
      role: message.role as UIMessage["role"],
      // Note: content will soon be deprecated in @ai-sdk/react
      content: "",
      createdAt: message.createdAt,
      annotations: message.annotations as UIMessage["annotations"],
    }));
  }

  return (
    <ChatInterface
      id={id}
      initialMessages={convertToUIMessages(messagesFromDb)}
    />
  );
}
