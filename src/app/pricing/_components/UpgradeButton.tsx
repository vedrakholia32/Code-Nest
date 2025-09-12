import { Zap } from "lucide-react";
import Link from "next/link";

export default function UpgradeButton() {
  const CHEKOUT_URL =
    "https://code-nest.lemonsqueezy.com/buy/5693741c-d6b4-4b58-92e2-bf4d956c5b5d";

  return (
    <Link
      href={CHEKOUT_URL}
      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white 
        bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg 
        hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95
        transition-all duration-200 cursor-pointer font-semibold shadow-xl shadow-blue-500/25 
        hover:shadow-2xl hover:shadow-blue-500/40 group"
    >
      <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
      Upgrade to Pro
    </Link>
  );
}
