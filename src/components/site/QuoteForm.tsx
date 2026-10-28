"use client";

import { useActionState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { createQuoteRequest, type QuoteState } from "@/lib/actions";

const initial: QuoteState = { status: "idle" };

export function QuoteForm({ variant = "inline" }: { variant?: "inline" }) {
  const [state, action, pending] = useActionState(createQuoteRequest, initial);
  const emailError = state.fieldErrors?.email;
  const phoneError = state.fieldErrors?.phone;

  if (state.status === "success") {
    return (
      <p role="status" className="text-cyan-700 text-[19px]">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} noValidate data-variant={variant}>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="quote-email" className="sr-only">
          Email address
        </label>
        <Input
          id="quote-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "quote-email-error" : undefined}
          className="sm:w-[310px]"
        />
        <label htmlFor="quote-phone" className="sr-only">
          Phone (optional)
        </label>
        <Input
          id="quote-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={30}
          placeholder="Phone (optional)"
          aria-invalid={phoneError ? true : undefined}
          className="sm:w-[210px]"
        />
        {/* Honeypot, hidden from people and assistive tech */}
        <div aria-hidden className="absolute -left-[9999px]">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>
      <label htmlFor="quote-message" className="sr-only">
        Short project description (optional)
      </label>
      <Textarea
        id="quote-message"
        name="message"
        rows={3}
        maxLength={1000}
        placeholder="Short project description (optional)"
        className="mt-2.5 block sm:w-[540px]"
      />
      <div className="mt-[20px]">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Request a quote"}
        </Button>
      </div>
      <p
        id="quote-email-error"
        role="alert"
        className="text-magenta mt-2.5 min-h-6 text-[15px]"
      >
        {emailError ?? phoneError ?? (state.status === "error" ? state.message : null)}
      </p>
    </form>
  );
}
