import Link from "next/link";

import { AnalyticsTracker } from "@/components/analytics-tracker";
import { HeroSection } from "@/components/hero-section";

const proofPoints = [
  "Track why files changed.",
  "Cut onboarding time.",
  "Make AI answers more useful."
];

const workflow = [
  {
    title: "Point Heimdall at your project folders",
    description: "No migration. No new file workflow."
  },
  {
    title: "Capture what changed and why",
    description: "Version history plus simple labels create a usable decision log."
  },
  {
    title: "Ask better questions later",
    description: "AI can answer with context instead of guesses."
  }
];

export default function Home() {
  return (
    <main className="page-shell">
      <AnalyticsTracker />
      <HeroSection />

      <section className="container" style={{ paddingBottom: "4rem" }}>
        <div
          className="panel hero-proof-grid"
          style={{
            borderRadius: "32px",
            padding: "1.5rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            animation: "riseIn 700ms ease both",
            animationDelay: "140ms"
          }}
        >
          {proofPoints.map((point) => (
            <div
              key={point}
              style={{
                padding: "1rem",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.44)",
                border: "1px solid rgba(51,42,32,0.08)"
              }}
            >
              <p style={{ margin: 0, lineHeight: 1.7, color: "var(--muted)" }}>
                {point}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ padding: "2rem 0 5rem" }}>
        <div
          className="feature-grid"
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            alignItems: "start"
          }}
        >
          <div>
            <span className="eyebrow">Why It Matters</span>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(2.4rem, 5vw, 4.4rem)",
                lineHeight: 0.95,
                margin: "1rem 0 1rem"
              }}
            >
              Files stay. Context disappears.
            </h2>
            <p
              style={{
                maxWidth: "38rem",
                color: "var(--muted)",
                lineHeight: 1.8,
                fontSize: "1.02rem"
              }}
            >
              Architecture teams can find the latest file, but not always the reason it changed.
              Heimdall keeps that missing context in one place.
            </p>
          </div>

          <div
            className="panel"
            style={{
              borderRadius: "30px",
              padding: "1.4rem",
              background:
                "linear-gradient(180deg, rgba(255,251,245,0.92) 0%, rgba(248,240,229,0.78) 100%)"
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "1rem"
              }}
            >
              {workflow.map((item, index) => (
                <div
                  key={item.title}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "0.9rem",
                    alignItems: "start"
                  }}
                >
                  <div
                    style={{
                      width: "2.4rem",
                      height: "2.4rem",
                      borderRadius: "50%",
                      background: "var(--accent-soft)",
                      color: "var(--accent-strong)",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 600
                    }}
                  >
                    0{index + 1}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.05rem" }}>{item.title}</h3>
                    <p
                      style={{
                        margin: 0,
                        lineHeight: 1.7,
                        color: "var(--muted)"
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: "6rem" }}>
        <div
          className="panel cta-grid"
          style={{
            borderRadius: "36px",
            padding: "2rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            alignItems: "center"
          }}
        >
          <div>
            <span className="eyebrow">Early Access</span>
            <h2
              style={{
                margin: "1rem 0 0.5rem",
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                lineHeight: 1
              }}
            >
              Join the waitlist for early access.
            </h2>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--muted)" }}>
              We are talking to firms that want faster onboarding, cleaner project memory, and
              better AI answers.
            </p>
          </div>

          <Link className="button-primary" href="/waitlist">
            Join waitlist
          </Link>
        </div>
      </section>
    </main>
  );
}
