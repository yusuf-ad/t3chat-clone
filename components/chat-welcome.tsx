"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

import {
  SparklesIcon,
  CompassIcon,
  CodeIcon,
  GraduationCap,
} from "lucide-react";

const actions = [
  { name: "Create", icon: SparklesIcon },
  { name: "Explore", icon: CompassIcon },
  { name: "Code", icon: CodeIcon },
  { name: "Learn", icon: GraduationCap },
];

const questions = [
  "How does AI work?",
  "Are black holes real?",
  "How many Rs are in the word 'Rust'?",
  "What is the meaning of life?",
];

const actionQuestions = {
  Create: [
    "Write a short story about a robot discovering emotions",
    "Help me outline a sci-fi novel set in a post-apocalyptic world",
    "Create a character profile for a complex villain with sympathetic motives",
    "Give me 5 creative writing prompts for flash fiction",
  ],
  Explore: [
    "Good books for fans of Rick Rubin",
    "Countries ranked by number of corgis",
    "Most successful companies in the world",
    "How much does Claude cost?",
  ],
  Code: [
    "Write code to invert a binary search tree in Python",
    "What's the difference between Promise.all and Promise.allSettled?",
    "Explain React's useEffect cleanup function",
    "Best practices for error handling in async/await",
  ],
  Learn: [
    "Beginner's guide to TypeScript",
    "Explain the CAP theorem in distributed systems",
    "Why is AI so expensive?",
    "Are black holes real?",
  ],
};

export default function ChatWelcome({
  isPreview,
  onQuestionClick,
}: {
  isPreview?: boolean;
  onQuestionClick?: (q: string) => void;
}) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const userName = user?.firstName ?? "";

  const handleActionClick = (actionName: string) => {
    setSelectedAction(actionName);
  };

  if (!isLoaded && !isPreview && isSignedIn) {
    return (
      <div className="animate-in fade-in-50 zoom-in-95 flex h-full flex-col items-center justify-center px-10 duration-300">
        <h2 className="text-interactive-secondary-text text-3xl font-bold tracking-wide">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-50 zoom-in-95 flex h-full flex-col items-center justify-center px-10 duration-300">
      <h2 className="text-interactive-secondary-text text-3xl font-bold tracking-wide">
        How can I help you{userName ? `, ${userName}` : ""}?
      </h2>

      <div className="my-8 flex w-full gap-4">
        {actions.map((action) => (
          <Button
            className={`${
              selectedAction === action.name
                ? "bg-sidebar-button hover:bg-sidebar-button-hover dark:text-white"
                : "bg-interactive-secondary text-interactive-secondary-text hover:bg-interactive-secondary-hover hover:text-interactive-secondary-text"
            } flex-1 cursor-pointer border-0 py-6 font-semibold`}
            key={action.name}
            onClick={() => handleActionClick(action.name)}
          >
            <action.icon className="mr-2 h-5 w-5" />
            {action.name}
          </Button>
        ))}
      </div>

      <div className="mt-4 flex w-full flex-col gap-2">
        {(selectedAction
          ? actionQuestions[selectedAction as keyof typeof actionQuestions]
          : questions
        ).map((question) => (
          <div
            key={question}
            className="border-sidebar-border-light flex-1 pb-1 not-last:border-b"
          >
            <Button
              className="text-interactive-ghost-text hover:bg-interactive-secondary-hover hover:text-interactive-secondary-text flex w-full cursor-pointer items-center justify-start bg-transparent py-5 font-semibold tracking-wide shadow-none"
              onClick={() => onQuestionClick?.(question)}
            >
              {question}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
