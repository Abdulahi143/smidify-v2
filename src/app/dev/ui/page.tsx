import { notFound } from "next/navigation";
import {
  Button,
  Card,
  Field,
  Halftone,
  Input,
  Tag,
  Textarea,
} from "@/components/ui";
import { PlateText, Wordmark } from "@/components/site";
import { SegmentedDemo } from "./Demo";

export const metadata = { title: "UI kit" };

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-[15px]">
      <h2 className="meta">{title}</h2>
      <div className="flex flex-wrap items-center gap-[15px]">{children}</div>
    </section>
  );
}

export default function UiPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="flex max-w-3xl flex-col gap-10 px-5 py-[84px] md:px-10">
      <div className="rule-masthead" />
      <h1 className="text-[40px] leading-[46px] md:text-[72px] md:leading-[78px]">
        UI kit
      </h1>
      <p>
        Body copy in Source Serif 4. A <a href="#">link</a> sits inline.
      </p>
      <p className="italic">True italic, for pull quotes only.</p>

      <Section title="Button">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="ghost" disabled>
          Disabled
        </Button>
      </Section>

      <Section title="Tag">
        <Tag>Cyan</Tag>
        <Tag tone="magenta">Magenta</Tag>
        <Tag tone="neutral">Neutral</Tag>
        <Tag tone="outline">Outline</Tag>
      </Section>

      <Section title="Segmented">
        <SegmentedDemo />
      </Section>

      <Section title="Fields">
        <Field label="Name" htmlFor="name" className="w-full">
          <Input id="name" placeholder="Ada Lovelace" />
        </Field>
        <Field label="Disabled" htmlFor="dis" className="w-full">
          <Input id="dis" disabled defaultValue="Can't edit" />
        </Field>
        <Field
          label="Email"
          htmlFor="email"
          error="Enter a valid email."
          className="w-full"
        >
          <Input id="email" aria-invalid defaultValue="nope" />
        </Field>
        <Field label="Message" htmlFor="msg" className="w-full">
          <Textarea id="msg" placeholder="Tell us about the project" />
        </Field>
      </Section>

      <Section title="Card">
        <Card className="w-64">Pipeline card on surface.</Card>
      </Section>

      <Section title="Wordmark">
        <Wordmark size="sm" />
        <Wordmark size="md" />
        <Wordmark size="lg" />
        <Wordmark size="xl" />
      </Section>

      <Section title="PlateText">
        <PlateText className="text-[72px] leading-none font-semibold">
          01
        </PlateText>
      </Section>

      <Section title="Halftone">
        <Halftone className="bg-cyan h-32 w-64" />
      </Section>
    </main>
  );
}
