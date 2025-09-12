import { SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

function LoginButton() {
  return (
    <SignInButton mode="modal">
      <button
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
        hover:from-blue-600 hover:to-blue-700 text-white rounded-lg
        transition-all duration-200 font-semibold shadow-xl shadow-blue-500/25 
        hover:shadow-2xl hover:shadow-blue-500/40 cursor-pointer 
        hover:scale-105 active:scale-95 group"
      >
        <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        <span>Sign In to Continue</span>
      </button>
    </SignInButton>
  );
}
export default LoginButton;