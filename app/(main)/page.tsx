import ChatInterface from "@/components/chat-interface";
import ChatWelcome from "@/components/chat-welcome";
import { PreviewChatInput } from "@/components/preview-chat-input";
import { createChat } from "@/lib/chat-store";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col px-2 pt-14">
        <ChatWelcome />
        <PreviewChatInput />
      </div>
    );
  }

  const id = await createChat();

  return <ChatInterface id={id} />;
}
