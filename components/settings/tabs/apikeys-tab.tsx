"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnthropicIcon } from "@/components/ui/icons/anthropic-icon";
import { TablerBrandOpenai } from "@/components/ui/icons/openai-icon";
import { Key, Globe } from "lucide-react";

// API Key provider configuration
const API_PROVIDERS = [
  {
    id: "openrouter",
    name: "OpenRouter API Key",
    icon: <Globe className="h-5 w-5" />,
    models: [
      "Multiple Models Available",
      "Claude, GPT, Gemini",
      "Llama, Mistral, and more",
    ],
    consoleUrl: "OpenRouter's Dashboard",
    consoleLink: "https://openrouter.ai/keys",
    placeholder: "sk-or-...",
  },
  {
    id: "openai",
    name: "OpenAI API Key",
    icon: <TablerBrandOpenai className="h-5 w-5" />,
    models: ["GPT-4.5", "o3", "o3 Pro"],
    consoleUrl: "OpenAI's Dashboard",
    consoleLink: "https://platform.openai.com/api-keys",
    placeholder: "sk-...",
  },
  {
    id: "anthropic",
    name: "Anthropic API Key",
    icon: <AnthropicIcon className="h-5 w-5" />,
    models: [
      "Claude 3.5 Sonnet",
      "Claude 3.7 Sonnet",
      "Claude 3.7 Sonnet (Reasoning)",
      "Claude 4 Opus",
      "Claude 4 Sonnet",
      "Claude 4 Sonnet (Reasoning)",
    ],
    consoleUrl: "Anthropic's Console",
    consoleLink: "https://console.anthropic.com/settings/keys",
    placeholder: "sk-ant-...",
  },
] as const;

export default function ApiKeysTab() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    anthropic: "",
    openai: "",
    openrouter: "",
  });

  const handleApiKeyChange = (providerId: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [providerId]: value,
    }));
  };

  const handleSave = (providerId: string) => {
    // TODO: Implement API key saving logic
    console.log(`Saving API key for ${providerId}:`, apiKeys[providerId]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-semibold">API Keys</h2>
        <p className="text-muted-foreground">
          Bring your own API keys for select models. Messages sent using your
          API keys will not count towards your monthly limits.
        </p>
      </div>

      {/* API Key Sections */}
      <div className="space-y-4">
        {API_PROVIDERS.map((provider) => (
          <div key={provider.id} className="space-y-4 rounded-lg border p-6">
            {/* Provider Header */}
            <div className="flex items-center gap-3">
              <Key className="text-muted-foreground h-4 w-4" />
              <h3 className="text-foreground text-lg font-medium">
                {provider.name}
              </h3>
            </div>

            {/* Models Used */}
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Used for the following models:
              </p>
              <div className="flex flex-wrap gap-2">
                {provider.models.map((model) => (
                  <Badge
                    key={model}
                    variant="secondary"
                    className="bg-sidebar-border-light text-xs font-normal"
                  >
                    {model}
                  </Badge>
                ))}
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-3">
              <Input
                type="password"
                value={apiKeys[provider.id]}
                onChange={(e) =>
                  handleApiKeyChange(provider.id, e.target.value)
                }
                placeholder={provider.placeholder}
                className="font-mono text-sm"
              />

              {/* Console Link */}
              <p className="text-muted-foreground text-sm">
                Get your API key from{" "}
                <a
                  href={provider.consoleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {provider.consoleUrl}
                </a>
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => handleSave(provider.id)}
                className="bg-interactive-primary hover:bg-interactive-primary-hover px-6 text-white"
                disabled={!apiKeys[provider.id].trim()}
              >
                Save
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
