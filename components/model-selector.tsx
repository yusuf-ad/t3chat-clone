"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, SparklesIcon } from "lucide-react";
import { TablerBrandOpenai } from "./ui/icons/openai-icon";
import { LogosMistralAiIcon } from "./ui/icons/mistral-icon";
import { AnthropicIcon } from "./ui/icons/anthropic-icon";
import { GoogleIcon } from "./ui/icons/google-icon";
import { useModel } from "@/contexts/model-context";
import {
  getModelById,
  getAllProviders,
  getModelsByProvider,
} from "@/lib/ai/ai-providers";
import { ModelInfo } from "./model-info";

// Provider icon mapping
const providerIcons: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  openai: TablerBrandOpenai,
  anthropic: AnthropicIcon,
  mistral: LogosMistralAiIcon,
  google: GoogleIcon,
};

export function ModelSelector({
  className,
  ...rest
}: React.ComponentProps<"button">) {
  const { selectedModel, setSelectedModel } = useModel();
  const currentModel = getModelById(selectedModel);
  const providers = getAllProviders();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${className} hover:bg-sidebar-border-light cursor-pointer px-2 select-none focus-visible:ring-0`}
          {...rest}
          variant="ghost"
        >
          <div className="flex items-center gap-2">
            {currentModel && (
              <>
                {React.createElement(providerIcons[currentModel.provider], {
                  className: "w-4 h-4",
                })}
                <span className="text-sm font-medium">{currentModel.name}</span>
              </>
            )}
          </div>
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start">
        {providers.map((provider) => {
          const models = getModelsByProvider(provider);
          const ProviderIcon = providerIcons[provider];

          return (
            <div key={provider}>
              <DropdownMenuLabel className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <ProviderIcon className="h-4 w-4" />
                {provider}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`hover:bg-sidebar-border-light focus:bg-sidebar-border-light cursor-pointer`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ProviderIcon className="h-4 w-4" />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {model.name}
                          </span>
                          <ModelInfo modelInfo={model.description} />
                        </div>
                      </div>
                      <div className="text-muted-foreground flex flex-col items-end text-xs">
                        <span>
                          ${model.pricing.input}/$${model.pricing.output}
                        </span>
                        <span>
                          {(model.contextWindow / 1000).toFixed(0)}K ctx
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {provider !== providers[providers.length - 1] && (
                <DropdownMenuSeparator />
              )}
            </div>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 text-xs">
          <SparklesIcon className="h-3 w-3" />
          Pricing per 1M tokens (input/output)
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
