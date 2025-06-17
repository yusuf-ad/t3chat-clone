import CustomButton from "@/components/custom-button";
import { tagIcons } from "./model-constants";

interface ModelTagButtonProps {
  tag: { icon: keyof typeof tagIcons; description: string };
}

export default function ModelTagButton({ tag }: ModelTagButtonProps) {
  return (
    <CustomButton
      description={tag.description}
      variant="outline"
      className="cursor-pointer border-0 bg-transparent p-0 text-xs hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
    >
      {tagIcons[tag.icon]}
    </CustomButton>
  );
}
