import { Message } from "ai";
import { ChatBubble, ChatBubbleMessage } from "./ui/chat-bubble";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <ChatBubble variant="sent">
        <ChatBubbleMessage className="bg-[#d2c4fa] text-black" variant="sent">
          {message.content}
        </ChatBubbleMessage>
      </ChatBubble>
    );
  }

  return (
    <ChatBubble variant="received">
      <ChatBubbleMessage variant="sent" className="bg-transparent text-black">
        {message.content}
      </ChatBubbleMessage>
    </ChatBubble>
  );
}
