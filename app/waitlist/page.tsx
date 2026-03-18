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
          <span aria-hidden="true">&larr;</span>
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
            alignItems: "stretch"
          }}
        >
          <div
            style={{
              animation: "riseIn 700ms ease both",
              display: "flex",
              flexDirection: "column",
              minHeight: "100%"
            }}
          >
            <span className="eyebrow">Join Waitlist</span>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(2.6rem, 5vw, 4.8rem)",
                lineHeight: 0.94,
                margin: "1rem 0 1rem"
              }}
            >
              Join the waitlist.
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: "32rem",
                color: "var(--muted)",
                lineHeight: 1.8
              }}
            >
              Tell us about your firm and we will reach out when Heimdall opens for early users.
            </p>

            <div
              className="panel"
              style={{
                marginTop: "auto",
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
                We review incoming requests and follow up when we open early access.
              </p>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.75 }}>
                Your details are only used for Heimdall updates and waitlist outreach.
              </p>
            </div>
          </div>

          <WaitlistForm />
        </div>
      </section>
    </main>
  );
}
