import ChatInterface from "@/components/chat-interface";
import { createChat } from "@/lib/chat-store";

export default async function Home() {
  const id = await createChat();

  return <ChatInterface id={id} />;
}
