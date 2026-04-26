import Link from "next/link";
import SocialLinks from "./SocialLinks";

const FOOTER_LINKS = [
  { href: "/", label: "Blog" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-retro-black dark:border-retro-white bg-retro-black dark:bg-retro-dark-bg text-retro-white mt-[var(--section-gap)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-[var(--container-padding)] py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-archivo font-black text-h3 text-retro-yellow">Coding Panda</p>
            <p className="font-space text-body-sm text-gray-400 mt-1">
              Coding Panda · Insights and tutorials for the modern developer.
            </p>
          </div>

          <div className="flex flex-col gap-4 items-start sm:items-end w-full sm:w-auto">
            <nav aria-label="Footer navigation">
              <ul className="flex gap-6">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="font-space text-sm font-bold uppercase hover:text-retro-yellow transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <SocialLinks iconOnly />
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-space text-xs text-gray-500 dark:text-gray-400">
            © {year} CodingPanda · Powered by XDEV200 · MIT License · Built with ♥
          </p>
          <p className="font-space text-xs text-gray-500 dark:text-gray-400">
            Brought to life with the support of Claude.ai, Antigravity, and RetroUI.dev
          </p>
        </div>
      </div>
    </footer>

  );
}
