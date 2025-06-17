"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ModelCard from "./model-card";
import { initialModels, AIModel } from "./model-constants";

export default function ModelsTab() {
  const [models, setModels] = useState<AIModel[]>(initialModels);

  const toggleModel = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, enabled: !model.enabled } : model,
      ),
    );
  };

  const toggleShowMore = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, showMore: !model.showMore } : model,
      ),
    );
  };

  const selectRecommended = () => {
    setModels((prev) =>
      prev.map((model) => ({
        ...model,
        enabled: ["gemini-2.5-flash", "gemini-2.0-flash"].includes(model.id),
      })),
    );
  };

  const unselectAll = () => {
    setModels((prev) => prev.map((model) => ({ ...model, enabled: false })));
  };

  const filterByFeatures = () => {
    // TODO: Implement filter functionality
    console.log("Filter by features clicked");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-semibold">
          Available Models
        </h2>
        <p className="text-muted-foreground">
          Choose which models appear in your model selector. This won't affect
          existing conversations.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={filterByFeatures}
          className="cursor-pointer text-sm"
        >
          Filter by features
        </Button>
        <Button
          variant="outline"
          onClick={selectRecommended}
          className="cursor-pointer text-sm"
        >
          Select Recommended Models
        </Button>
        <Button
          variant="outline"
          onClick={unselectAll}
          className="cursor-pointer text-sm"
        >
          Unselect All
        </Button>
      </div>

      {/* Models List */}
      <div className="space-y-4">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onToggle={toggleModel}
            onShowMore={toggleShowMore}
          />
        ))}
      </div>
    </div>
  );
}
