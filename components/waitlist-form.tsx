"use client";

import { FormEvent, useState } from "react";

type FormState = {
  company: string;
  role: string;
  email: string;
};

const initialState: FormState = {
  company: "",
  role: "",
  email: ""
};

async function trackConversion() {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event: "conversion"
      })
    });
  } catch {
    // Keep the success flow intact even if analytics storage fails.
  }
}

export function WaitlistForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.company || !form.role || !form.email) {
      setError("Please complete every field before joining the waitlist.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "We could not save your request.");
      }

      await trackConversion();
      setSuccess(true);
      setForm(initialState);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not save your request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section
        className="panel"
        style={{
          borderRadius: "34px",
          padding: "1.5rem",
          background:
            "linear-gradient(180deg, rgba(255,251,245,0.94) 0%, rgba(242,248,243,0.9) 100%)",
          animation: "riseIn 480ms ease both"
        }}
      >
        <span className="eyebrow">Request Received</span>
        <h2
          style={{
            margin: "1rem 0 0.75rem",
            fontFamily: "var(--font-display), serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            lineHeight: 1.08
          }}
        >
          You are on the list.
        </h2>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.8 }}>
          Thanks for your interest in Project Heimdall. We have saved your details and will reach
          out with launch updates, early access details, and your first-month-free offer.
        </p>
      </section>
    );
  }

  return (
    <form
      className="panel"
      onSubmit={handleSubmit}
      style={{
        borderRadius: "34px",
        padding: "1.5rem",
        display: "grid",
        gap: "1rem",
        animation: "riseIn 760ms ease both",
        animationDelay: "120ms",
        minHeight: "100%",
        alignContent: "start"
      }}
    >
      <div>
        <label htmlFor="company" style={{ display: "block", marginBottom: "0.5rem" }}>
          Company
        </label>
        <input
          id="company"
          type="text"
          value={form.company}
          onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
          placeholder="Studio or firm name"
          style={inputStyles}
        />
      </div>

      <div>
        <label htmlFor="role" style={{ display: "block", marginBottom: "0.5rem" }}>
          Role
        </label>
        <input
          id="role"
          type="text"
          value={form.role}
          onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
          placeholder="Project architect, principal, BIM lead..."
          style={inputStyles}
        />
      </div>

      <div>
        <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>
          Work email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="name@company.com"
          style={inputStyles}
        />
      </div>

      {error ? (
        <p
          style={{
            margin: 0,
            color: "#8b2d2b",
            background: "rgba(177, 67, 67, 0.08)",
            border: "1px solid rgba(177, 67, 67, 0.14)",
            padding: "0.85rem 1rem",
            borderRadius: "18px",
            lineHeight: 1.6
          }}
        >
          {error}
        </p>
      ) : null}

      <button className="button-primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Joining..." : "Join waitlist"}
      </button>
    </form>
  );
}

const inputStyles = {
  width: "100%",
  minHeight: "3.3rem",
  borderRadius: "18px",
  border: "1px solid rgba(51,42,32,0.12)",
  background: "rgba(255,255,255,0.78)",
  padding: "0.9rem 1rem",
  color: "var(--text)"
} as const;
