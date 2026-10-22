import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-28 md:px-[72px]">
      <h1 className="text-[40px] md:text-[72px]">Not found</h1>
      <p className="mt-[15px] text-[17px]">
        That page doesn&apos;t exist or isn&apos;t published. <Link href="/blog">Read the blog →</Link>
      </p>
    </div>
  );
}
