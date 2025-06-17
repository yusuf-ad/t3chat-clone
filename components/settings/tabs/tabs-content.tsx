"use client";

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import CustomizationTab from "./customization-tab";
import ModelsTab from "./models-tab";
import ApiKeysTab from "./apikeys-tab";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SettingsTabsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get("tab") || "customization";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs defaultValue={tab} onValueChange={handleTabChange} className="w-auto">
      <TabsList className="mb-6">
        <TabsTrigger className="cursor-pointer" value="customization">
          Customization
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="models">
          Models
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="api-keys">
          API Keys
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="contact-us">
          Contact us
        </TabsTrigger>
      </TabsList>
      <TabsContent value="customization">
        <CustomizationTab />
      </TabsContent>
      <TabsContent value="models">
        <ModelsTab />
      </TabsContent>
      <TabsContent value="api-keys">
        <ApiKeysTab />
      </TabsContent>
    </Tabs>
  );
}
