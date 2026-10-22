import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-[84px] md:px-[72px]" role="status" aria-label="Loading">
      <Skeleton className="h-[56px] w-full max-w-[640px]" />
      <Skeleton className="mt-[30px] h-[28px] w-full max-w-[440px]" />
      <Skeleton className="mt-[60px] aspect-[16/8] w-full" />
    </div>
  );
}
