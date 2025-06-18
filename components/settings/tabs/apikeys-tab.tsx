"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TablerBrandOpenai } from "@/components/ui/icons/openai-icon";
import { Key, CheckCircle, XCircle, Trash, Globe } from "lucide-react";
import {
  getStoredApiKeys,
  saveApiKey,
  removeApiKey,
  validateApiKey,
  type ApiKeyProvider,
} from "@/lib/api-keys";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import CustomButton from "@/components/custom-button";

// API Key provider configuration
const API_PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI API Key",
    icon: <TablerBrandOpenai className="h-5 w-5" />,
    models: ["GPT-4o", "GPT-4o Mini", "GPT-4 Turbo"],
    consoleUrl: "OpenAI's Dashboard",
    consoleLink: "https://platform.openai.com/api-keys",
    placeholder: "sk-...",
  },
  {
    id: "openrouter",
    name: "OpenRouter API Key",
    icon: <Globe className="h-5 w-5" />,
    models: [
      "Claude 3.5 Sonnet",
      "GPT-4o via OpenRouter",
      "Llama 3.1 405B",
      "Gemini Pro 1.5",
      "100+ More Models",
    ],
    consoleUrl: "OpenRouter's Dashboard",
    consoleLink: "https://openrouter.ai/keys",
    placeholder: "sk-or-...",
  },
] as const;

export default function ApiKeysTab() {
  const { isSignedIn } = useUser();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    openai: "",
    openrouter: "",
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({
    openai: false,
    openrouter: false,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});

  // Load saved API keys on component mount and when user signs in
  useEffect(() => {
    if (!isSignedIn) {
      // Kullanıcı çıkış yaptıysa state'i temizle
      setApiKeys({ openai: "", openrouter: "" });
      setSavedKeys({});
      setValidationErrors({});
      setShowKeys({ openai: false, openrouter: false });
      return;
    }

    const storedKeys = getStoredApiKeys();
    const loadedKeys: Record<string, string> = {};
    const savedStates: Record<string, boolean> = {};

    Object.entries(storedKeys).forEach(([provider, key]) => {
      if (key) {
        // Show masked version of the key
        loadedKeys[provider] = key;
        savedStates[provider] = true;
      }
    });

    setApiKeys((prev) => ({ ...prev, ...loadedKeys }));
    setSavedKeys(savedStates);
  }, [isSignedIn]);

  const handleApiKeyChange = (providerId: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [providerId]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[providerId]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[providerId];
        return newErrors;
      });
    }

    // Mark as not saved when modified
    setSavedKeys((prev) => ({
      ...prev,
      [providerId]: false,
    }));
  };

  const handleSave = async (providerId: string) => {
    const apiKey = apiKeys[providerId];

    if (!apiKey.trim()) {
      setValidationErrors((prev) => ({
        ...prev,
        [providerId]: "API key is required",
      }));
      return;
    }

    // Validate the API key format
    const validation = validateApiKey(providerId as ApiKeyProvider, apiKey);

    if (!validation.isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        [providerId]: validation.error || "Invalid API key format",
      }));
      return;
    }

    try {
      // Save the API key
      saveApiKey(providerId as ApiKeyProvider, apiKey);

      // Mark as saved
      setSavedKeys((prev) => ({
        ...prev,
        [providerId]: true,
      }));

      // Clear any validation errors
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[providerId];
        return newErrors;
      });

      toast.success(
        `${providerId.charAt(0).toUpperCase() + providerId.slice(1)} API key saved successfully!`,
      );
    } catch {
      toast.error("Failed to save API key. Please try again.");
    }
  };

  const handleRemove = (providerId: string) => {
    try {
      removeApiKey(providerId as ApiKeyProvider);

      setApiKeys((prev) => ({
        ...prev,
        [providerId]: "",
      }));

      setSavedKeys((prev) => ({
        ...prev,
        [providerId]: false,
      }));

      toast.success(
        `${providerId.charAt(0).toUpperCase() + providerId.slice(1)} API key removed successfully!`,
      );
    } catch {
      toast.error("Failed to remove API key. Please try again.");
    }
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
      <form className="space-y-4">
        {API_PROVIDERS.map((provider) => (
          <div key={provider.id} className="space-y-4 rounded-lg border p-6">
            {/* Provider Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="text-muted-foreground h-4 w-4" />
                <h3 className="text-foreground text-lg font-medium">
                  {provider.name}
                </h3>
              </div>

              {savedKeys[provider.id] && (
                <CustomButton
                  className="bg-transparent hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleRemove(provider.id)}
                >
                  <Trash className="h-4 w-4" />
                </CustomButton>
              )}
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
              {savedKeys[provider.id] && !validationErrors[provider.id] ? (
                <>
                  {
                    <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      API key configured
                    </p>
                  }
                </>
              ) : (
                <>
                  <div className="relative">
                    <Input
                      type={showKeys[provider.id] ? "text" : "password"}
                      value={apiKeys[provider.id]}
                      onChange={(e) =>
                        handleApiKeyChange(provider.id, e.target.value)
                      }
                      placeholder={provider.placeholder}
                      className={`pr-20 font-mono text-sm ${
                        validationErrors[provider.id] ? "border-red-500" : ""
                      } ${savedKeys[provider.id] ? "border-green-500" : ""}`}
                    />

                    {/* Status Indicator */}
                    {savedKeys[provider.id] && (
                      <CheckCircle className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-green-500" />
                    )}
                    {validationErrors[provider.id] && (
                      <XCircle className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-red-500" />
                    )}
                  </div>

                  {/* Validation Error */}
                  {validationErrors[provider.id] && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors[provider.id]}
                    </p>
                  )}

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
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => handleSave(provider.id)}
                className="bg-interactive-primary hover:bg-interactive-primary-hover px-6 text-white"
                disabled={
                  !apiKeys[provider.id].trim() || savedKeys[provider.id]
                }
              >
                {savedKeys[provider.id] ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
}
