"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { Badge } from "../ui/badge";

const SUGGESTED_TRAITS = [
  "friendly",
  "witty",
  "concise",
  "curious",
  "empathetic",
  "creative",
  "patient",
];

export default function CustomizationTab() {
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [traitInput, setTraitInput] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleAddTrait = (trait: string) => {
    if (
      trait.trim() &&
      !selectedTraits.includes(trait.trim()) &&
      selectedTraits.length < 10
    ) {
      setSelectedTraits([...selectedTraits, trait.trim()]);
      setTraitInput("");
    }
  };

  const handleRemoveTrait = (traitToRemove: string) => {
    setSelectedTraits(
      selectedTraits.filter((trait) => trait !== traitToRemove),
    );
  };

  const handleTraitInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleAddTrait(traitInput);
    }
  };

  const handleSuggestedTraitClick = (trait: string) => {
    handleAddTrait(trait);
  };

  const totalTraitsLength = selectedTraits.join("").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-chat-text mb-8 text-2xl font-semibold">
          Customize T3 Chat
        </h1>
      </div>

      <div className="space-y-6">
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-chat-text text-sm font-medium">
            What should T3 Chat call you?
          </label>
          <div className="relative">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 50))}
              placeholder="Enter your name"
              className="pr-12"
              maxLength={50}
            />
            <span className="text-text-muted absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              {name.length}/50
            </span>
          </div>
        </div>

        {/* Occupation Field */}
        <div className="flex flex-col gap-2">
          <label className="text-chat-text text-sm font-medium">
            What do you do?
          </label>
          <div className="relative">
            <Input
              value={occupation}
              onChange={(e) => setOccupation(e.target.value.slice(0, 100))}
              placeholder="Engineer, student, etc."
              className="pr-16"
              maxLength={100}
            />
            <span className="text-text-muted absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              {occupation.length}/100
            </span>
          </div>
        </div>

        {/* Traits Field */}
        <div className="flex flex-col gap-2">
          <label className="text-chat-text text-sm font-medium">
            What traits should T3 Chat have?{" "}
            <span className="text-text-muted ml-1 text-xs font-normal">
              (up to 50, max 100 chars each)
            </span>
          </label>

          {/* Trait Input */}
          <div className="relative">
            <Input
              value={traitInput}
              onChange={(e) => setTraitInput(e.target.value.slice(0, 100))}
              onKeyDown={handleTraitInputKeyDown}
              placeholder="Type a trait and press Enter or Tab..."
              className="pr-12"
              maxLength={100}
            />
            <span className="text-text-muted absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              {totalTraitsLength}/50
            </span>
          </div>

          {/* Selected Traits */}
          {selectedTraits.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTraits.map((trait, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-interactive-secondary text-interactive-secondary-text hover:bg-interactive-secondary-hover"
                >
                  {trait}
                  <button
                    onClick={() => handleRemoveTrait(trait)}
                    className="hover:text-destructive ml-1"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Suggested Traits */}
          <div className="mt-1 flex flex-wrap gap-2">
            {SUGGESTED_TRAITS.filter(
              (trait) => !selectedTraits.includes(trait),
            ).map((trait) => (
              <button
                key={trait}
                onClick={() => handleSuggestedTraitClick(trait)}
                className="bg-interactive-ghost dark:text-text-muted text-interactive-ghost-text hover:bg-interactive-ghost-hover inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-[3px] text-xs transition-colors"
                disabled={
                  selectedTraits.length >= 10 ||
                  totalTraitsLength + trait.length > 50
                }
              >
                {trait}
                <Plus size={12} />
              </button>
            ))}
          </div>
        </div>

        {/* Additional Info Field */}
        <div className="flex flex-col gap-2">
          <label className="text-chat-text text-sm font-medium">
            Anything else T3 Chat should know about you?
          </label>
          <div className="relative">
            <Textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value.slice(0, 3000))}
              placeholder="Interests, values, or preferences to keep in mind"
              className="min-h-24 resize-none pr-16"
              maxLength={3000}
            />
            <span className="text-text-muted absolute right-3 bottom-3 text-xs">
              {additionalInfo.length}/3000
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button className="bg-interactive-primary hover:bg-interactive-primary-hover ml-auto cursor-pointer px-8 text-white">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
