import CustomButton from "@/components/custom-button";
import ModeToggle from "@/components/mode-toggle";
import ProfileCard from "@/components/settings/profile-card";
import { SignOutButton } from "@clerk/nextjs";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomizationTab from "@/components/settings/customization-tab";

export default async function SettingsPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col overflow-y-auto px-4 pt-6 pb-24 md:px-6 lg:px-8">
      {/* Back to Chat */}
      <header className="flex items-center justify-between pb-8">
        <CustomButton
          asChild
          className="hover:bg-sidebar-border-light! w-auto bg-transparent px-4 py-2"
          variant="ghost"
        >
          <Link
            href="/"
            className="text-primary flex items-center gap-3 text-sm font-semibold"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Chat
          </Link>
        </CustomButton>

        <div className="flex items-center gap-2">
          <ModeToggle className="bg-transparent" />

          <SignOutButton>
            <CustomButton
              className="hover:bg-sidebar-border-light! h-auto w-auto bg-transparent"
              variant="ghost"
            >
              Sign out
            </CustomButton>
          </SignOutButton>
        </div>
      </header>

      <main className="flex flex-col gap-4 md:flex-row">
        <div className="hidden space-y-8 md:block md:w-1/4">
          <ProfileCard />
        </div>
        <div className="md:w-3/4 md:pl-12">
          <Tabs defaultValue="customization" className="w-auto">
            <TabsList className="mb-6">
              <TabsTrigger className="cursor-pointer" value="customization">
                Customization
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="models">
                Models
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="API Keys">
                API Keys
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="Contact us">
                Contact us
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customization">
              <CustomizationTab />
            </TabsContent>
            <TabsContent value="models">Change your password here.</TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
