import ChatInterface from "@/components/chat-interface";
import ChatWelcome from "@/components/chat-welcome";
import { PreviewChatInput } from "@/components/preview-chat-input";
import { generateUUID } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col px-2 pt-14">
        <ChatWelcome isPreview={true} />
        <PreviewChatInput />
      </div>
    );
  }

  const id = generateUUID();

  return <ChatInterface id={id} />;
}
