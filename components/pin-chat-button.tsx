"use client";

import { Pin, PinOff } from "lucide-react";
import CustomButton from "./custom-button";

export default function PinChatButton({
  chatId,
  isPinned,
  onPin,
}: {
  chatId: string;
  isPinned: boolean;
  onPin: (chatId: string) => void;
}) {
  return (
    <CustomButton
      onClick={() => onPin(chatId)}
      className="hover:bg-sidebar-button-hover hover:text-white"
    >
      {isPinned ? <PinOff /> : <Pin />}
    </CustomButton>
  );
}
