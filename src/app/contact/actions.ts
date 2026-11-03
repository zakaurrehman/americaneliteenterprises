"use server";

import { headers } from "next/headers";
import { inquiryTypes } from "@/content/contact";

export type ContactField = "name" | "email" | "phone" | "inquiry" | "message";

export type ContactState = {
  status: "idle" | "success" | "error" | "unconfigured";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
};

const MIN_FILL_MS = 3000;
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

// Best-effort, per-instance rate limit. Use a shared store (e.g. Redis) when
// running multiple instances.
const submissions = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (submissions.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  submissions.set(key, recent);
  return recent.length > RATE_LIMIT.max;
}

const clean = (v: FormDataEntryValue | null) =>
  typeof v === "string" ? v.replace(/\r\n/g, "\n").trim() : "";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: clean(formData.get("name")),
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone")),
    inquiry: clean(formData.get("inquiry")),
    message: clean(formData.get("message")),
  };

  // Spam checks: hidden honeypot field and a minimum time to fill the form.
  const honeypot = clean(formData.get("company_website"));
  const startedAt = Number(clean(formData.get("started_at")));
  if (honeypot || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
    return {
      status: "error",
      message: "Your message could not be sent. Please wait a moment and try again.",
      values,
    };
  }

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2 || values.name.length > 100) {
    errors.name = "Please enter your name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email) || values.email.length > 200) {
    errors.email = "Please enter a valid email address.";
  }
  if (values.phone && !/^[0-9+().\-\s]{7,25}$/.test(values.phone)) {
    errors.phone = "Please enter a valid phone number, or leave this blank.";
  }
  if (!inquiryTypes.includes(values.inquiry)) {
    errors.inquiry = "Please choose the subject of your inquiry.";
  }
  if (values.message.length < 10) {
    errors.message = "Please write a message of at least 10 characters.";
  } else if (values.message.length > 5000) {
    errors.message = "Please keep your message under 5,000 characters.";
  }
  if (Object.keys(errors).length) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "Too many messages from this connection. Please try again later, or call us.",
      values,
    };
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return {
      status: "unconfigured",
      message:
        "Online messaging is not connected yet, so your message was not sent. Please email or call us directly using the details on this page.",
      values,
    };
  }

  const rows: [string, string][] = [
    ["Name", values.name],
    ["Email", values.email],
    ["Phone", values.phone || "—"],
    ["Inquiry", values.inquiry],
  ];
  const html = `<h2>New inquiry from americaneliteenterprises.com</h2><table>${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p>${escapeHtml(values.message).replace(/\n/g, "<br>")}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL.split(",").map((s) => s.trim()),
        reply_to: values.email,
        subject: `Website inquiry: ${values.inquiry} — ${values.name}`,
        html,
        text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${values.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  } catch (error) {
    console.error("Contact form delivery failed:", error);
    return {
      status: "error",
      message:
        "We couldn't send your message just now. Please try again shortly, or email or call us directly.",
      values,
    };
  }

  return {
    status: "success",
    message: "Thank you — your message has been sent. We will be in touch soon.",
  };
}
