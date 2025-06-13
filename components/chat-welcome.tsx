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
    "How can I create a new project?",
    "What are the best practices for starting a new application?",
    "How do I set up a development environment?",
    "What tools should I use for my project?",
  ],
  Explore: [
    "What are the latest trends in technology?",
    "How can I discover new programming languages?",
    "What are some interesting open-source projects?",
    "How do I find learning resources?",
  ],
  Code: [
    "How do I debug my code effectively?",
    "What are some common coding patterns?",
    "How can I improve my code quality?",
    "What are the best practices for testing?",
  ],
  Learn: [
    "What are the fundamentals I should learn first?",
    "How can I improve my programming skills?",
    "What are the best learning resources?",
    "How do I stay updated with new technologies?",
  ],
};

export default function ChatWelcome() {
  const { user, isLoaded } = useUser();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const userName = user?.firstName ?? "";

  const handleActionClick = (actionName: string) => {
    setSelectedAction(actionName);
  };

  if (!isLoaded) {
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
            <Button className="text-interactive-ghost-text hover:bg-interactive-secondary-hover hover:text-interactive-secondary-text flex w-full cursor-pointer items-center justify-start bg-transparent py-5 font-semibold tracking-wide shadow-none">
              {question}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
