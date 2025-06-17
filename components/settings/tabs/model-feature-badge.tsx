import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { modelFeatures } from "./model-constants";

interface ModelFeatureBadgeProps {
  featureId: string;
}

export default function ModelFeatureBadge({
  featureId,
}: ModelFeatureBadgeProps) {
  const feature = modelFeatures[featureId];
  if (!feature) return null;
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge
          variant="secondary"
          className={`flex items-center gap-1 text-xs ${feature.color || ""}`}
        >
          {feature.icon}
          {feature.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{feature.description}</TooltipContent>
    </Tooltip>
  );
}
