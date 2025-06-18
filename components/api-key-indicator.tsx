"use client";

import { Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { hasValidApiKey } from "@/lib/api-keys";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface ApiKeyIndicatorProps {
  modelId: string;
  className?: string;
}

export default function ApiKeyIndicator({
  modelId,
  className,
}: ApiKeyIndicatorProps) {
  const { isSignedIn } = useUser();
  const [usingCustomKey, setUsingCustomKey] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setUsingCustomKey(false);
      return;
    }

    // Check if user has a custom API key for the current model's provider
    if (modelId.startsWith("openai:")) {
      setUsingCustomKey(hasValidApiKey("openai"));
    } else {
      setUsingCustomKey(false);
    }
  }, [modelId, isSignedIn]);

  if (!usingCustomKey) {
    return null;
  }

  return (
    <Badge
      variant="secondary"
      className={`border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 ${className}`}
    >
      <Key className="mr-1 h-3 w-3" />
      Using your API key
    </Badge>
  );
}
