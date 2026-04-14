import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <div className="inline-block border-2 border-retro-black shadow-neo-xl bg-retro-yellow px-8 py-12">
        <p className="font-archivo font-black text-8xl text-retro-black mb-4">404</p>
        <p className="font-space font-bold text-xl text-retro-black mb-8">
          This page doesn&apos;t exist.
        </p>
        <Link
          href="/blogs"
          className="inline-block font-space font-bold text-sm px-6 py-3 bg-retro-black text-retro-white border-2 border-retro-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover transition-all duration-100"
        >
          ← Back to Blogs
        </Link>
      </div>
    </div>
  );
}
