"use client";

import { ModelSelector } from "@/components/model-selector";
import {
  ChatInput,
  ChatInputSubmit,
  ChatInputTextArea,
} from "@/components/ui/chat-input";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function PreviewChatInput() {
  const [showWelcome, setShowWelcome] = useState(true);
  const router = useRouter();

  const handleClick = () => {
    toast("Please sign in to continue", {
      action: {
        label: "Go to auth",
        onClick: () => {
          router.push("/auth");
        },
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="sticky bottom-0 mt-auto flex w-full flex-col items-center"
    >
      <div className="absolute inset-0 h-full rounded-2xl rounded-t-[20px] rounded-b-none border-8 border-b-0 bg-white/30 backdrop-blur-md dark:bg-black/30" />

      {showWelcome && (
        <div className="animate-slide-up absolute -top-20 mx-auto w-fit">
          <div className="blur-fallback:bg-secondary relative my-4 flex items-center gap-3 rounded-xl border border-green-400/20 bg-green-300/50 px-5 py-3 pr-10 text-green-800 shadow-lg backdrop-blur-md dark:border-green-800/20 dark:bg-green-800/30 dark:text-green-100/90">
            <div>
              <span>Welcome to the t3chat clone! </span>
              <Link
                className="underline hover:text-green-950 dark:hover:text-green-100"
                href="/auth"
              >
                Please sign in to continue.
              </Link>
            </div>

            <button
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-green-800 hover:text-green-950 dark:text-green-100/90 dark:hover:text-green-100"
              onClick={() => setShowWelcome(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <ChatInput
        variant="default"
        className="border-sidebar-border/5 focus-within:ring-sidebar-border text-sidebar-logo relative min-h-28 w-full rounded-2xl rounded-t-[20px] rounded-b-none border-8 border-b-0 bg-transparent font-semibold shadow-xl"
      >
        <ChatInputTextArea
          className="text-chat-text placeholder:text-text-placeholder cursor-not-allowed dark:bg-transparent"
          placeholder="Type your message here..."
          disabled
        />
        <ModelSelector className="absolute bottom-2 left-4" />
        <ChatInputSubmit className="bg-sidebar-button hover:bg-sidebar-button-hover h-10 w-10 cursor-not-allowed rounded-lg opacity-50" />
      </ChatInput>
    </div>
  );
}
