import Link from "next/link";

import { WaitlistForm } from "@/components/waitlist-form";

export default function WaitlistPage() {
  return (
    <main className="page-shell">
      <section className="container" style={{ padding: "2rem 0 1rem" }}>
        <Link
          href="/"
          style={{
            color: "var(--muted)",
            display: "inline-flex",
            gap: "0.45rem",
            alignItems: "center"
          }}
        >
          <span aria-hidden="true">←</span>
          Back to overview
        </Link>
      </section>

      <section className="container" style={{ padding: "1rem 0 6rem" }}>
        <div
          className="waitlist-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
            gap: "1.5rem",
            alignItems: "start"
          }}
        >
          <div style={{ animation: "riseIn 700ms ease both" }}>
            <span className="eyebrow">Join Waitlist</span>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(2.6rem, 5vw, 4.8rem)",
                lineHeight: 0.94,
                margin: "1rem 0 1rem"
              }}
            >
              Tell us who you are, and we will reach out when Heimdall opens.
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: "32rem",
                color: "var(--muted)",
                lineHeight: 1.8
              }}
            >
              We are prioritizing teams that want better project memory, cleaner decision
              tracking, and a stronger foundation for context-aware AI in architecture.
            </p>

            <div
              className="panel"
              style={{
                marginTop: "1.5rem",
                borderRadius: "30px",
                padding: "1.25rem",
                display: "grid",
                gap: "0.75rem"
              }}
            >
              <div>
                <strong>What happens next</strong>
              </div>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.75 }}>
                We review incoming waitlist requests, group interest by team profile, and share
                updates when we open new conversations or pilot access.
              </p>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.75 }}>
                Your details are only used for Heimdall-related outreach and waitlist management.
              </p>
            </div>
          </div>

          <WaitlistForm />
        </div>
      </section>
    </main>
  );
}

