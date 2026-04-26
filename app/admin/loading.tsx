import { Spinner } from "@/components/ui/Spinner";

/**
 * Root loading state for the Admin dashboard.
 */
export default function AdminLoading() {
  return <Spinner fullScreen text="Loading Dashboard..." size={40} />;
}
