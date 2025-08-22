import {
  SignedIn,
  SignOutButton,
  SignUpButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <SignedOut>
        <SignUpButton>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>

      <UserButton />

      <SignedIn>
        <SignOutButton>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Sign Out
          </button>
        </SignOutButton>
      </SignedIn>
    </div>
  );
}
