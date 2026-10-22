import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="flex flex-col gap-[30px]" role="status" aria-label="Loading">
      <Skeleton className="h-[52px] w-[280px]" />
      <Skeleton className="h-[44px] w-full max-w-[520px]" />
      <Skeleton className="h-[320px] w-full" />
    </div>
  );
}
