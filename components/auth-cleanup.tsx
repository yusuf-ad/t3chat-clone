"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { getStoredApiKeys, saveApiKeys } from "@/lib/api-keys";

/**
 * Bu component kullanıcı çıkış yaptığında API keylerini temizler
 * Güvenlik için önemli - API keyleri hassas bilgilerdir
 */
export default function AuthCleanup() {
  const { isSignedIn, user } = useUser();
  const prevSignedInRef = useRef<boolean | null>(null);

  useEffect(() => {
    // İlk render'da önceki durumu kaydet
    if (prevSignedInRef.current === null) {
      prevSignedInRef.current = isSignedIn ?? null;
      return;
    }

    // Kullanıcı çıkış yaptıysa (önceden giriş yapmıştı, şimdi yapmıyor)
    if (prevSignedInRef.current === true && isSignedIn === false) {
      console.log("Kullanıcı çıkış yaptı, API keyleri temizleniyor...");

      // Tüm API keylerini temizle
      const currentKeys = getStoredApiKeys();
      if (Object.keys(currentKeys).length > 0) {
        saveApiKeys({}); // Boş obje ile tüm keyleri temizle
        console.log("API keyleri başarıyla temizlendi");
      }
    }

    // Mevcut durumu kaydet
    prevSignedInRef.current = isSignedIn ?? null;
  }, [isSignedIn]);

  // Bu component hiçbir şey render etmez, sadece cleanup işlevi görür
  return null;
}
