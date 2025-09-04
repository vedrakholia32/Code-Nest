"use client";
import LoginButton from "@/comonents/LoginButton";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { User } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useEffect } from "react";

function HeaderProfileBtn() {
  const { user } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  // Sync user data when signed in
  useEffect(() => {
    if (user) {
      syncUser({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "",
      });
    }
  }, [user, syncUser]);

  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Profile"
              labelIcon={<User className="size-4" />}
              href="/profile"
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>

      <SignedOut>
        <LoginButton />
      </SignedOut>
    </>
  );
}
export default HeaderProfileBtn;