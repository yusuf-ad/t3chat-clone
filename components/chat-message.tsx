import { Message } from "ai";
import { ChatBubble, ChatBubbleMessage } from "./ui/chat-bubble";
import { MarkdownContent } from "./ui/markdown-content";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <ChatBubble variant="sent">
        <ChatBubbleMessage
          className="bg-chat-user-background text-chat-text"
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
        className="text-chat-text bg-transparent"
      >
        <MarkdownContent content={message.content} id={message.id} />
      </ChatBubbleMessage>
    </ChatBubble>
  );
}
