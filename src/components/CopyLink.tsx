import React, { useState } from "react";
import { IoLink } from "react-icons/io5";

const CopyLink = ({ className }: { className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={`relative inline-flex items-center justify-center ${className}`}
      onClick={handleCopy}
      aria-label="Copy Link"
    >
      <IoLink className="text-xl" />
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
          Copied!
        </span>
      )}
    </button>
  );
};

export default CopyLink;
