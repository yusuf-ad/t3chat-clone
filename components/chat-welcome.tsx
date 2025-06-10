import { Button } from "@/components/ui/button";

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

export default function ChatWelcome() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-10">
      <h2 className="text-interactive-secondary-text text-3xl font-bold tracking-wide">
        How can I help you, Yusuf?
      </h2>

      <div className="my-8 flex w-full gap-4">
        {actions.map((action) => (
          <Button
            className="bg-interactive-secondary text-interactive-secondary-text hover:bg-interactive-secondary-hover hover:text-interactive-secondary-text flex-1 cursor-pointer border-0 py-6 font-semibold"
            key={action.name}
          >
            <action.icon className="mr-2 h-5 w-5" />
            {action.name}
          </Button>
        ))}
      </div>

      <div className="mt-4 flex w-full flex-col gap-2">
        {questions.map((question) => (
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
