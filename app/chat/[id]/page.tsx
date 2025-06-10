import ChatInterface from "@/components/chat-interface";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ChatInterface id={id} />;
}
