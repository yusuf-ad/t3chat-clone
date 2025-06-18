/* eslint-disable @typescript-eslint/no-explicit-any */

import { openai as originalOpenAI, createOpenAI } from "@ai-sdk/openai";
import { anthropic as originalAnthropic } from "@ai-sdk/anthropic";
import { mistral as originalMistral } from "@ai-sdk/mistral";
import { google as originalGoogle } from "@ai-sdk/google";
import { createProviderRegistry, customProvider } from "ai";

// Model configuration types
export type ModelConfig = {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  pricing: {
    input: number; // per 1M tokens
    output: number; // per 1M tokens
  };
};

// Available models configuration
export const MODELS: ModelConfig[] = [
  // OpenAI Models
  {
    id: "openai:gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "OpenAI's flagship model, versatile and powerful",
    contextWindow: 128000,
    pricing: { input: 2.5, output: 10 },
  },
  {
    id: "openai:gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Faster, cost-effective GPT-4o variant",
    contextWindow: 128000,
    pricing: { input: 0.15, output: 0.6 },
  },
  {
    id: "openai:gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "openai",
    description: "High-performance model with latest knowledge",
    contextWindow: 128000,
    pricing: { input: 10, output: 30 },
  },

  // Anthropic Models
  {
    id: "anthropic:claude-3-5-sonnet-20240620",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    description: "Best balance of intelligence, speed, and cost",
    contextWindow: 200000,
    pricing: { input: 3, output: 15 },
  },
  {
    id: "anthropic:claude-3-opus-20240229",
    name: "Claude 3 Opus",
    provider: "anthropic",
    description: "Most capable model for complex tasks",
    contextWindow: 200000,
    pricing: { input: 15, output: 75 },
  },
  {
    id: "anthropic:claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    description: "Fastest model for simple tasks",
    contextWindow: 200000,
    pricing: { input: 0.25, output: 1.25 },
  },

  // Mistral Models
  {
    id: "mistral:mistral-large-latest",
    name: "Mistral Large",
    provider: "mistral",
    description: "Flagship model for complex reasoning",
    contextWindow: 128000,
    pricing: { input: 2, output: 6 },
  },
  {
    id: "mistral:mistral-small-latest",
    name: "Mistral Small",
    provider: "mistral",
    description: "Cost-effective model for simple tasks",
    contextWindow: 128000,
    pricing: { input: 0.2, output: 0.6 },
  },

  // Google Models
  {
    id: "google:gemini-1.5-pro-002",
    name: "Gemini 1.5 Pro",
    provider: "google",
    description: "Google's most capable multimodal model",
    contextWindow: 2000000,
    pricing: { input: 1.25, output: 5 },
  },
  {
    id: "google:gemini-1.5-flash-002",
    name: "Gemini 1.5 Flash",
    provider: "google",
    description: "Fast and efficient multimodal model",
    contextWindow: 1000000,
    pricing: { input: 0.075, output: 0.3 },
  },
];

// Custom providers with model aliases
export const openai = customProvider({
  languageModels: {
    "gpt-4o": originalOpenAI("gpt-4o", {
      structuredOutputs: true,
    }),
    "gpt-4o-mini": originalOpenAI("gpt-4o-mini", {
      structuredOutputs: true,
    }),
    "gpt-4-turbo": originalOpenAI("gpt-4-turbo"),
    // Aliases for easier access
    flagship: originalOpenAI("gpt-4o", {
      structuredOutputs: true,
    }),
    fast: originalOpenAI("gpt-4o-mini", {
      structuredOutputs: true,
    }),
  },
  fallbackProvider: originalOpenAI,
});

export const anthropic = customProvider({
  languageModels: {
    "claude-3-5-sonnet-20240620": originalAnthropic(
      "claude-3-5-sonnet-20240620",
    ),
    "claude-3-opus-20240229": originalAnthropic("claude-3-opus-20240229"),
    "claude-3-haiku-20240307": originalAnthropic("claude-3-haiku-20240307"),
    // Aliases
    sonnet: originalAnthropic("claude-3-5-sonnet-20240620"),
    opus: originalAnthropic("claude-3-opus-20240229"),
    haiku: originalAnthropic("claude-3-haiku-20240307"),
    best: originalAnthropic("claude-3-5-sonnet-20240620"),
  },
  fallbackProvider: originalAnthropic,
});

export const mistral = customProvider({
  languageModels: {
    "mistral-large-latest": originalMistral("mistral-large-latest"),
    "mistral-small-latest": originalMistral("mistral-small-latest"),
    // Aliases
    large: originalMistral("mistral-large-latest"),
    small: originalMistral("mistral-small-latest"),
  },
  fallbackProvider: originalMistral,
});

export const google = customProvider({
  languageModels: {
    "gemini-1.5-pro-002": originalGoogle("gemini-1.5-pro-002"),
    "gemini-1.5-flash-002": originalGoogle("gemini-1.5-flash-002"),
    // Aliases
    pro: originalGoogle("gemini-1.5-pro-002"),
    flash: originalGoogle("gemini-1.5-flash-002"),
  },
  fallbackProvider: originalGoogle,
});

// Provider registry
export const registry = createProviderRegistry(
  {
    openai,
    anthropic,
    mistral,
    google,
  },
  { separator: ":" },
);

// Helper functions
export function getModelById(modelId: string): ModelConfig | undefined {
  return MODELS.find((model) => model.id === modelId);
}

export function getModelsByProvider(provider: string): ModelConfig[] {
  return MODELS.filter((model) => model.provider === provider);
}

export function getAllProviders(): string[] {
  return Array.from(new Set(MODELS.map((model) => model.provider)));
}

// Default model configuration
export const DEFAULT_MODEL = "openai:gpt-4o-mini";

// Create custom OpenAI provider with user's API key
export function createCustomOpenAIProvider(apiKey: string) {
  const customOpenAI = createOpenAI({
    apiKey: apiKey,
    compatibility: "strict",
  });

  return customProvider({
    languageModels: {
      "gpt-4o": customOpenAI("gpt-4o", {
        structuredOutputs: true,
      }),
      "gpt-4o-mini": customOpenAI("gpt-4o-mini", {
        structuredOutputs: true,
      }),
      "gpt-4-turbo": customOpenAI("gpt-4-turbo"),
      // Aliases for easier access
      flagship: customOpenAI("gpt-4o", {
        structuredOutputs: true,
      }),
      fast: customOpenAI("gpt-4o-mini", {
        structuredOutputs: true,
      }),
    },
    fallbackProvider: customOpenAI,
  });
}

// Get language model from registry or custom provider
export function getLanguageModel(
  modelId: string,
  customApiKeys?: { openai?: string },
) {
  // If user provided OpenAI API key and is using OpenAI model, use custom provider
  if (customApiKeys?.openai && modelId.startsWith("openai:")) {
    const customProvider = createCustomOpenAIProvider(customApiKeys.openai);
    const modelName = modelId.replace("openai:", "");
    return customProvider.languageModel(modelName as any);
  }

  // Otherwise use the default registry
  return registry.languageModel(modelId as any);
}
