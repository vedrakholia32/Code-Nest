"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      type="button"
      className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group relative cursor-pointer hover:scale-110 active:scale-95"
    >
      {copied ? (
        <Check className="size-4 text-green-400" />
      ) : (
        <Copy className=" size-4 text-gray-400 group-hover:text-gray-300 group-hover:rotate-12 transition-transform duration-200" />
      )}
    </button>
  );
}

export default CopyButton;