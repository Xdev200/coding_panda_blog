"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Github } from "lucide-react";

const ThemeToggle = dynamic(
  () => import("@/components/ui/ThemeToggle").then((mod) => mod.ThemeToggle),
  {
    ssr: false,
    loading: () => <div className="w-10 h-10 border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface shadow-neo dark:shadow-neo-dark" />,
  }
);

export function Navbar() {
  return (
    <header className="border-b-2 border-retro-black dark:border-retro-white bg-retro-yellow dark:bg-retro-dark-bg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-archivo font-black text-retro-black dark:text-retro-yellow text-2xl tracking-tight hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-retro-black dark:focus-visible:ring-retro-yellow transition-colors"
          >
            Coding Panda
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="https://github.com/Logging-Studio/RetroUI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface text-retro-black dark:text-retro-white shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all focus:outline-none focus:ring-2 focus:ring-retro-yellow"
              aria-label="GitHub Repository"
            >
              <Github size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
