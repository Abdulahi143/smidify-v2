import { Button } from "@/components/ui";
import { signOut } from "@/lib/actions";

export default function Forbidden() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1280px] flex-col justify-center gap-[20px] px-5 py-[84px] md:px-[72px]">
      <p className="meta">403</p>
      <h1 className="text-[40px] leading-[46px] md:text-[72px] md:leading-[78px]">Not allowed.</h1>
      <p className="max-w-[48ch] text-[19px] leading-[30px]">
        This account isn’t an admin. Sign out and try another account.
      </p>
      <form action={signOut}>
        <Button type="submit">Sign out</Button>
      </form>
    </main>
  );
}
