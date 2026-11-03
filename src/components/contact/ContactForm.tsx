"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContact, type ContactField, type ContactState } from "@/app/contact/actions";
import { inquiryTypes } from "@/content/contact";
import { site } from "@/content/site";
import { ArrowRight } from "@/components/ui/icons";

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const statusRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);

  // Timestamp for the server-side minimum-fill-time check (set after the form
  // renders, and again after each attempt since React resets the form).
  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, [state]);

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  const v = state.values ?? {};
  const err = state.errors ?? {};

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="glass rounded-2xl border-accent/40 p-10 outline-none"
      >
        <p className="label-mono text-accent">Message sent</p>
        <p className="mt-4 font-display text-2xl font-semibold text-fg">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-6">
      {state.status !== "idle" && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className={`rounded-md border p-5 text-[0.95rem] outline-none ${
            state.status === "unconfigured"
              ? "border-accent/60 bg-accent/10 text-fg"
              : "border-danger/40 bg-danger/10 text-fg"
          }`}
        >
          <p>{state.message}</p>
          {state.status !== "error" || !state.errors ? (
            <p className="mt-2">
              <a href={site.contact.emailHref} className="font-semibold underline underline-offset-4">
                {site.contact.email}
              </a>{" "}
              ·{" "}
              <a href={site.contact.phoneHref} className="font-semibold underline underline-offset-4">
                {site.contact.phoneDisplay}
              </a>
            </p>
          ) : null}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Full name" error={err.name} required>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            defaultValue={v.name}
            {...describe("name", err.name)}
            className={inputClass(err.name)}
          />
        </Field>
        <Field id="email" label="Email address" error={err.email} required>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            defaultValue={v.email}
            {...describe("email", err.email)}
            className={inputClass(err.email)}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="phone" label="Phone number" hint="Optional" error={err.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={25}
            defaultValue={v.phone}
            {...describe("phone", err.phone)}
            className={inputClass(err.phone)}
          />
        </Field>
        <Field id="inquiry" label="Inquiry type" error={err.inquiry} required>
          <select
            id="inquiry"
            name="inquiry"
            required
            defaultValue={v.inquiry ?? ""}
            {...describe("inquiry", err.inquiry)}
            className={`${inputClass(err.inquiry)} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='none'%20stroke='%23a1a1aa'%20stroke-width='1.5'%3E%3Cpath%20d='m4%206%204%204%204-4'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`}
          >
            <option value="" disabled>
              Choose a subject
            </option>
            {inquiryTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="message" label="Message" error={err.message} required>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          minLength={10}
          maxLength={5000}
          defaultValue={v.message}
          {...describe("message", err.message)}
          className={`${inputClass(err.message)} min-h-40 resize-y py-3`}
        />
      </Field>

      {/* Spam protection: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedRef} type="hidden" name="started_at" defaultValue="" />

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-fg-muted">
          Fields marked <span aria-hidden>*</span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group sheen inline-flex min-h-13 items-center justify-center gap-3 rounded-xl bg-accent px-8 font-semibold text-on-accent transition-colors hover:bg-accent-deep active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Sending…" : "Send message"}
          <ArrowRight width={18} height={18} className="arrow-nudge" />
        </button>
      </div>
    </form>
  );
}

function describe(field: ContactField, error?: string) {
  return error
    ? { "aria-invalid": true as const, "aria-describedby": `${field}-error` }
    : {};
}

function inputClass(error?: string) {
  return `block min-h-13 w-full rounded-xl border bg-surface px-4 text-[1rem] text-fg outline-none transition-colors placeholder:text-fg-subtle focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/50 ${
    error ? "border-danger" : "border-line hover:border-line-strong"
  }`;
}

function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium text-fg">
        <span>
          {label}
          {required && (
            <span aria-hidden className="ml-0.5 text-accent">
              *
            </span>
          )}
        </span>
        {hint && <span className="text-xs font-normal text-fg-muted">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
