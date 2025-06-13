import ChatInterface from "@/components/chat-interface";
import { PreviewChatInput } from "@/components/preview-chat-input";
import { loadChat } from "@/lib/chat-store";
import { auth } from "@clerk/nextjs/server";

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
  const messages = await loadChat(id);

  return <ChatInterface id={id} initialMessages={messages} />;
}
