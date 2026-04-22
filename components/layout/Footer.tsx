import Link from "next/link";
import SocialLinks from "./SocialLinks";

const FOOTER_LINKS = [
  { href: "https://github.com/Xdev200", label: "GitHub" },
  { href: "/", label: "Blog" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-retro-black dark:border-retro-white bg-retro-black dark:bg-retro-dark-bg text-retro-white mt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-archivo font-black text-2xl text-retro-yellow">Coding Panda</p>
            <p className="font-space text-sm text-gray-400 mt-1">
              Coding Panda · Insights and tutorials for the modern developer.
            </p>
          </div>

          <div className="flex flex-col gap-4 items-end">
            <SocialLinks iconOnly />
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-6">
          <p className="font-space text-xs text-gray-500 dark:text-gray-400">
            © {year} CodingPanda Powered by XDEV200 · MIT License · Built with ♥ and thick borders
          </p>
        </div>
      </div>
    </footer>
  );
}
