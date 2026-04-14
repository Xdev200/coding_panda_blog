import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <div className="inline-block border-2 border-retro-black dark:border-retro-white shadow-neo-xl dark:shadow-neo-dark-xl bg-retro-yellow dark:bg-retro-dark-surface px-8 py-12">
        <p className="font-archivo font-black text-8xl text-retro-black dark:text-retro-yellow mb-4">404</p>
        <p className="font-space font-bold text-xl text-retro-black dark:text-retro-white mb-8">
          This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block font-space font-bold text-sm px-6 py-3 bg-retro-black dark:bg-retro-yellow text-retro-white dark:text-retro-black border-2 border-retro-black dark:border-retro-white shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all duration-100"
        >
          ← Back to Blogs
        </Link>
      </div>
    </div>
  );
}
