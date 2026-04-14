import Link from "next/link";

const FOOTER_LINKS = [
  { href: "https://retroui.dev/docs", label: "Documentation" },
  { href: "https://github.com/Logging-Studio/RetroUI", label: "GitHub" },
  { href: "/", label: "Blog" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-retro-black bg-retro-black text-retro-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-archivo font-black text-2xl text-retro-yellow">Coding Panda</p>
            <p className="font-space text-sm text-gray-400 mt-1">
              Coding Panda · Insights and tutorials for the modern developer.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="font-space text-sm text-gray-300 hover:text-retro-yellow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-retro-yellow"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="font-space text-xs text-gray-500">
            © {year} CodingPanda Powered by XDEV200 · MIT License · Built with ♥ and thick borders
          </p>
        </div>
      </div>
    </footer>
  );
}
