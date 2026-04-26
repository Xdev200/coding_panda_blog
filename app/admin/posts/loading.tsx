import { Spinner } from "@/components/ui/Spinner";

/**
 * Loading state specifically for the Admin Posts page.
 */
export default function AdminPostsLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Spinner text="Fetching Posts..." size={32} />
    </div>
  );
}
