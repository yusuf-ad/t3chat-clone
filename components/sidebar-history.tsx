import { getChatHistory } from "@/server/actions/chat";
import { attempt } from "@/lib/try-catch";
import ChatList from "./chat-list";

export default async function SidebarHistory({ userId }: { userId: string }) {
  const [chatHistory, chatHistoryError] = await attempt(
    getChatHistory({ userId }),
  );

  if (chatHistoryError) {
    return <div>Error loading chat history</div>;
  }

  return <ChatList chats={chatHistory} />;
}
