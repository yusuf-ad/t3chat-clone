"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { getStoredApiKeys, saveApiKeys } from "@/lib/api-keys";

/**
 * This component cleans up API keys when the user signs out
 * Important for security - API keys are sensitive information
 */
export default function AuthCleanup() {
  const { isSignedIn, user } = useUser();
  const prevSignedInRef = useRef<boolean | null>(null);

  useEffect(() => {
    // Save the previous state on first render
    if (prevSignedInRef.current === null) {
      prevSignedInRef.current = isSignedIn ?? null;
      return;
    }

    // If user signed out (was previously signed in, now is not)
    if (prevSignedInRef.current === true && isSignedIn === false) {
      console.log("User signed out, cleaning up API keys...");

      // Clear all API keys
      const currentKeys = getStoredApiKeys();
      if (Object.keys(currentKeys).length > 0) {
        saveApiKeys({}); // Clear all keys with empty object
        console.log("API keys successfully cleared");
      }
    }

    // Save current state
    prevSignedInRef.current = isSignedIn ?? null;
  }, [isSignedIn]);

  // This component renders nothing, it only serves as a cleanup function
  return null;
}
