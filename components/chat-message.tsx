import { Message } from "ai";
import { ChatBubble, ChatBubbleMessage } from "./ui/chat-bubble";
import { MarkdownContent } from "./ui/markdown-content";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <ChatBubble variant="sent">
        <ChatBubbleMessage
          className="bg-[#d2c4fa] text-[#2f025a]"
          variant="sent"
        >
          <MarkdownContent content={message.content} id={message.id} />
        </ChatBubbleMessage>
      </ChatBubble>
    );
  }

  return (
    <ChatBubble variant="received">
      <ChatBubbleMessage
        variant="sent"
        className="bg-transparent text-[#2f025a]"
      >
        <MarkdownContent content={message.content} id={message.id} />
      </ChatBubbleMessage>
    </ChatBubble>
  );
}
