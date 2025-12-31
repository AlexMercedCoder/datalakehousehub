import React, { useState } from "react";
import { IoCopyOutline, IoCheckmarkOutline } from "react-icons/io5";

const CopyCode = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Find the code block. The button is placed inside the wrapper, so we look for 'pre' or 'code' sibling/child.
    // Structure: <div wrapper> <button> <pre>...
    const wrapper = e.currentTarget.parentElement;
    const pre = wrapper?.querySelector("pre");
    const code = pre?.innerText || "";

    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      aria-label="Copy code"
    >
      {copied ? <IoCheckmarkOutline size={18} /> : <IoCopyOutline size={18} />}
    </button>
  );
};

export default CopyCode;
