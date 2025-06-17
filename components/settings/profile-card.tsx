import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function ProfileCard() {
  const user = await currentUser();

  return (
    <div className="text-center">
      <Image
        src={user?.imageUrl ?? "/avatar.png"}
        className="mx-auto rounded-full"
        alt="User avatar"
        width={160}
        height={160}
      />
      <h1 className="mt-4 text-center text-2xl font-bold">{user?.fullName}</h1>
      <p className="text-muted-foreground text-center text-sm">
        {user?.emailAddresses[0].emailAddress}
      </p>

      <div className="bg-sidebar-button mx-auto mt-2 w-fit rounded-full px-3 font-semibold">
        <span className="text-muted text-xs">Pro Plan</span>
      </div>
    </div>
  );
}
