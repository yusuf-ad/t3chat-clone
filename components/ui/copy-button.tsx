"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import clsx from "clsx";
import CustomButton from "../custom-button";
import { toast } from "sonner";

interface CopyButtonProps {
  value: string;
  className?: string;
  text?: string;
}

export default function CopyButton({
  value,
  className,
  text,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    toast.success("Copied to clipboard");

    await navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <CustomButton
      description="Copy message"
      className={clsx("bg-transparent", className)}
      onClick={copyToClipboard}
    >
      <div className="relative flex h-4 w-4 items-center justify-center">
        <Copy
          className={clsx("absolute transition-opacity", {
            "opacity-0 duration-0": isCopied,
            "duration-300": !isCopied,
          })}
        />
        <Check
          className={clsx("absolute transition-opacity", {
            "opacity-100 duration-0": isCopied,
            "opacity-0 duration-300": !isCopied,
          })}
        />
      </div>
      {text && <span>{text}</span>}
    </CustomButton>
  );
}
