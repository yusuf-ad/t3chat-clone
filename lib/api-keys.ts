// API Key management utilities
const API_KEYS_STORAGE_KEY = "ai-chat-api-keys";

export type ApiKeyProvider = "openai" | "anthropic" | "openrouter";

export interface ApiKeys {
  openai?: string;
  anthropic?: string;
  openrouter?: string;
}

export interface ApiKeyValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Get all stored API keys from localStorage
 */
export function getStoredApiKeys(): ApiKeys {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(API_KEYS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to parse stored API keys:", error);
    return {};
  }
}

/**
 * Save API keys to localStorage
 */
export function saveApiKeys(apiKeys: ApiKeys): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(apiKeys));
  } catch (error) {
    console.error("Failed to save API keys:", error);
    throw new Error("Failed to save API keys");
  }
}

/**
 * Save a single API key
 */
export function saveApiKey(provider: ApiKeyProvider, apiKey: string): void {
  const currentKeys = getStoredApiKeys();
  saveApiKeys({
    ...currentKeys,
    [provider]: apiKey,
  });
}

/**
 * Remove an API key
 */
export function removeApiKey(provider: ApiKeyProvider): void {
  const currentKeys = getStoredApiKeys();
  delete currentKeys[provider];
  saveApiKeys(currentKeys);
}

/**
 * Get a specific API key
 */
export function getApiKey(provider: ApiKeyProvider): string | undefined {
  const keys = getStoredApiKeys();
  return keys[provider];
}

/**
 * Validate OpenAI API key format
 */
export function validateOpenAiApiKey(apiKey: string): ApiKeyValidationResult {
  if (!apiKey || typeof apiKey !== "string") {
    return { isValid: false, error: "API key is required" };
  }

  const trimmedKey = apiKey.trim();

  if (trimmedKey.length === 0) {
    return { isValid: false, error: "API key cannot be empty" };
  }

  // Basic format validation for OpenAI keys
  if (!trimmedKey.startsWith("sk-")) {
    return { isValid: false, error: 'OpenAI API key must start with "sk-"' };
  }

  if (trimmedKey.length < 40) {
    return { isValid: false, error: "OpenAI API key appears to be too short" };
  }

  return { isValid: true };
}

/**
 * Validate API key format based on provider
 */
export function validateApiKey(
  provider: ApiKeyProvider,
  apiKey: string,
): ApiKeyValidationResult {
  switch (provider) {
    case "openai":
      return validateOpenAiApiKey(apiKey);
    case "anthropic":
      if (!apiKey.startsWith("sk-ant-")) {
        return {
          isValid: false,
          error: 'Anthropic API key must start with "sk-ant-"',
        };
      }
      return { isValid: true };
    case "openrouter":
      if (!apiKey.startsWith("sk-or-")) {
        return {
          isValid: false,
          error: 'OpenRouter API key must start with "sk-or-"',
        };
      }
      return { isValid: true };
    default:
      return { isValid: false, error: "Unknown provider" };
  }
}

/**
 * Check if user has a valid API key for a provider
 */
export function hasValidApiKey(provider: ApiKeyProvider): boolean {
  const apiKey = getApiKey(provider);
  if (!apiKey) return false;

  const validation = validateApiKey(provider, apiKey);
  return validation.isValid;
}

/**
 * Remove all API keys from localStorage
 */
export function clearAllApiKeys() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(API_KEYS_STORAGE_KEY);
}
