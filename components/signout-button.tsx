"use client";

import { clearAllApiKeys } from "@/lib/api-keys";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function CustomSignOutButton() {
  const handleSignOut = () => {
    clearAllApiKeys();
  };

  return (
    <SignOutButton>
      <Button
        onClick={handleSignOut}
        className="text-sidebar-logo hover:bg-sidebar-border-light cursor-pointer bg-transparent shadow-none"
        variant="ghost"
      >
        Sign out
      </Button>
    </SignOutButton>
  );
}
