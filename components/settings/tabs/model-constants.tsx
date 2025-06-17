import React from "react";
import { Eye, FileText, Search, ExternalLink, Zap, Key, FlaskConical } from "lucide-react";
import { GoogleIcon } from "@/components/ui/icons/google-icon";
import { AnthropicIcon } from "@/components/ui/icons/anthropic-icon";
import { TablerBrandOpenai } from "@/components/ui/icons/openai-icon";
import { LogosMistralAiIcon } from "@/components/ui/icons/mistral-icon";
import { MaterialSymbolsDiamondOutline } from "@/components/ui/icons/diamond-icon";

export interface ModelFeature {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  description?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: "google" | "anthropic" | "openai" | "mistral";
  description: string;
  features: string[];
  enabled: boolean;
  showMore?: boolean;
  modelTags?: { icon: keyof typeof tagIcons; description: string }[];
}

export const modelFeatures: Record<string, ModelFeature> = {
  vision: {
    id: "vision",
    label: "Vision",
    icon: <Eye className="h-3 w-3" />,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    description: "Supports image and video analysis",
  },
  pdfs: {
    id: "pdfs",
    label: "PDFs",
    icon: <FileText className="h-3 w-3" />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    description: "Supports PDF uploads and analysis",
  },
  search: {
    id: "search",
    label: "Search",
    icon: <Search className="h-3 w-3" />,
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    description: "Uses search to answer questions",
  },
  reasoning: {
    id: "reasoning",
    label: "Reasoning",
    icon: <ExternalLink className="h-3 w-3" />,
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    description: "Has reasoning capabilities",
  },
  fast: {
    id: "fast",
    label: "Fast",
    icon: <Zap className="h-3 w-3" />,
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    description: "Optimized for speed and quick responses",
  },
};

export const tagIcons: Record<string, React.ReactNode> = {
  experimental: (
    <span title="Experimental">
      <FlaskConical className="h-3 w-3 text-orange-500" />
    </span>
  ),
  requiresApiKey: (
    <span title="Requires API Key">
      <Key className="h-3 w-3 text-blue-500" />
    </span>
  ),
  premium: (
    <span title="Premium">
      <MaterialSymbolsDiamondOutline className="h-3 w-3 text-yellow-500" />
    </span>
  ),
};

export const initialModels: AIModel[] = [
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description:
      "Google's flagship model, known for speed and accuracy (and also web search!). Not quite as smart as Claude 3.5 Sonnet, but WAY faster and cheaper. Also has an insanely large context window (it can handle a lot of data).",
    features: ["vision", "pdfs", "search"],
    enabled: false,
    showMore: false,
    modelTags: [
      {
        icon: "experimental",
        description: "Experimental model",
      },
    ],
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    provider: "google",
    description:
      "Similar to 2.0 Flash, but even faster. Optimized for quick responses while maintaining high quality output.",
    features: ["fast", "vision", "pdfs", "reasoning"],
    enabled: false,
    showMore: false,
    modelTags: [
      {
        icon: "requiresApiKey",
        description: "Requires API Key",
      },
    ],
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description:
      "Google's latest fast model, known for speed and accuracy. It also includes web search capabilities for real-time information.",
    features: ["vision", "pdfs", "search"],
    enabled: true,
    showMore: false,
    modelTags: [
      {
        icon: "premium",
        description: "Premium Model",
      },
    ],
  },
];

export const providerIcons = {
  google: <GoogleIcon className="h-6 w-6" />,
  anthropic: <AnthropicIcon className="h-6 w-6" />,
  openai: <TablerBrandOpenai className="h-6 w-6" />,
  mistral: <LogosMistralAiIcon className="h-6 w-6" />,
}; 