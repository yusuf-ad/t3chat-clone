"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { TablerBrandOpenai } from "./ui/icons/openai-icon";
import { LogosMistralAiIcon } from "./ui/icons/mistral-icon";
import { ModelInfo } from "./model-info";

type ModelInfo = {
  name: string;
  description: string;
};

type ModelProvider = {
  providerName: string;
  availableModels: ModelInfo[];
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const modelProviders: ModelProvider[] = [
  {
    providerName: "openai",
    availableModels: [
      {
        name: "gpt-4o-mini",
        description: "Faster less precise GPT-4o",
      },
      {
        name: "gpt-4o",
        description: "OpenAI's flagship; versatile and powerful",
      },
    ],
    Icon: TablerBrandOpenai,
  },
  {
    providerName: "mistral",
    availableModels: [
      {
        name: "mistral-large-latest",
        description: "Mistral's balanced model for general use",
      },
    ],
    Icon: LogosMistralAiIcon,
  },
];

export function ModelSelector({
  className,
  ...rest
}: React.ComponentProps<"button">) {
  const [model, setModel] = React.useState("gpt-4o-mini");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${className} px-2 hover:bg-sidebar-border-light cursor-pointer focus-visible:ring-0 select-none`}
          {...rest}
          variant="ghost"
        >
          {model}
          <ChevronDownIcon className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          {modelProviders.map((provider) => (
            <DropdownMenuGroup key={provider.providerName}>
              {provider.availableModels.map((model) => (
                <DropdownMenuItem
                  key={model.name}
                  onClick={() => setModel(model.name)}
                  className="hover:bg-sidebar-border-light focus:bg-sidebar-border-light"
                >
                  <provider.Icon className="w-4 h-4 mr-2" />
                  {model.name}
                  <ModelInfo modelInfo={model.description} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
