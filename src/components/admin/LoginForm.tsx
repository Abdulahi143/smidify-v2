"use client";

import { useActionState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { signIn, type LoginState } from "@/lib/actions";

const initial: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initial);
  const { email, password } = state.fieldErrors ?? {};

  return (
    <form action={action} noValidate className="flex flex-col gap-[20px]">
      <Field label="Email" htmlFor="login-email" error={email}>
        <Input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={email ? true : undefined}
        />
      </Field>
      <Field label="Password" htmlFor="login-password" error={password}>
        <Input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={password ? true : undefined}
        />
      </Field>
      {state.message ? (
        <p role="alert" className="text-magenta text-[15px]">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
