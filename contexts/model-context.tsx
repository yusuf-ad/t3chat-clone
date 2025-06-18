"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { DEFAULT_MODEL } from "@/lib/ai/ai-providers";

interface ModelContextType {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
  const [selectedModel, setSelectedModelState] = useState(DEFAULT_MODEL);

  // İlk renderdan sonra localStorage'dan oku
  useEffect(() => {
    const stored = localStorage.getItem("selectedModel");
    if (stored && stored !== selectedModel) {
      setSelectedModelState(stored);
    }
  }, []);

  const setSelectedModel = (model: string) => {
    setSelectedModelState(model);
    localStorage.setItem("selectedModel", model);
  };

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
}
