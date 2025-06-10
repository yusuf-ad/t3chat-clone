import ChatInterface from "@/components/chat-interface";
import { loadChat } from "@/lib/chat-store";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const messages = await loadChat(id);

  return <ChatInterface id={id} initialMessages={messages} />;
}
