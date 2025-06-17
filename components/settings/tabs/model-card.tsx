import { Switch } from "@/components/ui/switch";

import { providerIcons, AIModel } from "./model-constants";
import ModelTagButton from "./model-tag-button";
import ModelFeatureBadge from "./model-feature-badge";

interface ModelCardProps {
  model: AIModel;
  onToggle: (id: string) => void;
  onShowMore: (id: string) => void;
}

export default function ModelCard({
  model,
  onToggle,
  onShowMore,
}: ModelCardProps) {
  return (
    <div className="flex items-start justify-between rounded-lg border p-4">
      <div className="flex flex-1 items-start gap-4">
        {/* Provider Icon */}
        <div className="mt-1 flex-shrink-0">
          {providerIcons[model.provider]}
        </div>
        {/* Model Info */}
        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center">
              <h3 className="text-foreground font-medium">{model.name}</h3>
              {model.modelTags &&
                model.modelTags.map((tag, idx) => (
                  <ModelTagButton key={idx} tag={tag} />
                ))}
            </div>
            <div className="mb-4">
              <p className="text-muted-foreground text-sm">
                {model.showMore
                  ? model.description
                  : model.description.split(". ")[0]}
              </p>
              <button
                onClick={() => onShowMore(model.id)}
                className="text-primary cursor-pointer text-xs"
              >
                {model.showMore ? "Show less" : "Show more"}
              </button>
            </div>
          </div>
          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {model.features.map((featureId) => (
              <ModelFeatureBadge key={featureId} featureId={featureId} />
            ))}
          </div>
        </div>
      </div>
      {/* Toggle Switch */}
      <div className="ml-4 flex-shrink-0">
        <Switch
          checked={model.enabled}
          onCheckedChange={() => onToggle(model.id)}
          className="data-[state=checked]:bg-sidebar-button"
        />
      </div>
    </div>
  );
}
