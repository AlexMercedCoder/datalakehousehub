import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchResult {
  url: string;
  excerpt: string;
  meta: {
    title: string;
    image?: string;
  };
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command+K to open
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  // Autofocus when open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    // Lock body scroll
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Search logic
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
        // @ts-ignore
      const pagefind = await window.pagefind; 
      if (!pagefind) {
        // dynamic load if not present (should be loaded by script in layout or auto)
        // for Astro static, we rely on pagefind.js being available at /pagefind/pagefind.js
        const imported = await import(/* @vite-ignore */ "/pagefind/pagefind.js");
        // @ts-ignore
        window.pagefind = imported;
      }
      // @ts-ignore
      const search = await window.pagefind.search(val);
      const data = await Promise.all(search.results.map((r: any) => r.data()));
      setResults(data);
    } catch (err) {
      console.error("Pagefind error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-text dark:text-light hover:text-primary transition-colors text-sm border border-border dark:border-darkmode-border rounded-md px-3 py-1.5 min-w-[150px]"
      >
        <FaSearch />
        <span className="opacity-70">Search...</span>
        <span className="ml-auto text-xs border border-border dark:border-darkmode-border rounded px-1.5 opacity-60">⌘K</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm p-4">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-2xl bg-body dark:bg-darkmode-body rounded-xl shadow-2xl border border-border dark:border-darkmode-border overflow-hidden animate-fade-in-down">
        
        {/* Header / Input */}
        <div className="flex items-center p-4 border-b border-border dark:border-darkmode-border gap-3">
          <FaSearch className="text-lg opacity-50" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-lg text-text dark:text-white placeholder:opacity-50 focus:ring-0 p-0"
            placeholder="Search documentation..."
            value={query}
            onChange={handleSearch}
          />
          <button onClick={() => setIsOpen(false)} className="opacity-50 hover:opacity-100 p-1">
             <span className="bg-theme-light dark:bg-darkmode-theme-light px-2 py-1 rounded text-xs font-bold">ESC</span>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
            {loading && <div className="p-4 text-center opacity-60">Searching...</div>}
            
            {!loading && results.length === 0 && query.length > 1 && (
                <div className="p-8 text-center opacity-60">No results found for "{query}"</div>
            )}

            {results.map((result, idx) => (
                <a 
                    key={idx} 
                    href={result.url}
                    className="block p-4 rounded-lg hover:bg-theme-light dark:hover:bg-darkmode-theme-light mb-2 transition-colors group"
                    onClick={() => setIsOpen(false)}
                >
                    <h3 className="font-bold text-lg text-primary group-hover:underline mb-1">{result.meta.title}</h3>
                    <p className="text-sm opacity-80" dangerouslySetInnerHTML={{ __html: result.excerpt }} />
                </a>
            ))}
            
            {query.length < 2 && (
                <div className="p-8 text-center opacity-40 text-sm">Type to search the Data Lakehouse Hub</div>
            )}
        </div>
      </div>
    </div>
  );
}
