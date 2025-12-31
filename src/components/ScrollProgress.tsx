import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollProgress() {
  const [scroll, setScroll] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScroll(scrolled);
      setShowTopBtn(winScroll > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="fixed top-0 left-0 z-[9999] h-1 bg-primary transition-all duration-300 ease-out" style={{ width: `${scroll}%` }} />
      
      <button
        onClick={goToTop}
        className={`fixed bottom-8 right-8 z-[999] p-3 rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:bg-primary/80 hover:-translate-y-1 ${
          showTopBtn ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"
        }`}
        aria-label="Back to Top"
      >
        <FaArrowUp />
      </button>
    </>
  );
}
