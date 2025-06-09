import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type ScrollButtonAlignment = "left" | "center" | "right";

interface ScrollButtonProps {
  onClick: () => void;
  alignment?: ScrollButtonAlignment;
  className?: string;
}

export function ScrollButton({
  onClick,
  alignment = "right",
  className,
}: ScrollButtonProps) {
  const alignmentClasses = {
    left: "left-4",
    center: "left-1/2 -translate-x-1/2",
    right: "right-4",
  };

  return (
    <Button
      variant="secondary"
      className={cn(
        "absolute bottom-4 rounded-full hover:bg-chat-scroll-hover text-chat-scroll-text cursor-pointer bg-sidebar text-xs font-semibold h-8 border-2 border-sidebar-border shadow-none",
        alignmentClasses[alignment],
        className
      )}
      onClick={onClick}
    >
      Scroll to bottom
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
}

interface ChatMessageAreaProps {
  children: ReactNode;
  className?: string;
  scrollButtonAlignment?: ScrollButtonAlignment;
}

export function ChatMessageArea({ children, className }: ChatMessageAreaProps) {
  return (
    <ScrollArea className="relative flex-1">
      <div className={cn(className, "min-h-0")}>{children}</div>
    </ScrollArea>
  );
}

ChatMessageArea.displayName = "ChatMessageArea";
