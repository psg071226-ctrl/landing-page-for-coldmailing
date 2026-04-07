"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { SiteLogo } from "@/components/site-logo";

async function trackAnalyticsEvent(event: "cta_click") {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ event })
    });
  } catch {
    // Keep the CTA flow smooth even if analytics logging fails.
  }
}

export function HeroSection() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleJoinWaitlist = async () => {
    if (isTransitioning) {
      return;
    }

    setIsTransitioning(true);

    void trackAnalyticsEvent("cta_click");

    window.setTimeout(() => {
      startTransition(() => {
        router.push("/waitlist");
      });
    }, 220);
  };

  return (
    <section className="container" style={{ padding: "1.5rem 0 4.5rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          padding: "0.8rem 0 1.75rem"
        }}
      >
        <SiteLogo compact />
        <Link className="button-secondary" href="/waitlist">
          Join waitlist
        </Link>
      </header>

      <div
        className="hero-grid"
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "minmax(0, 1fr) minmax(360px, 0.88fr)",
          alignItems: "stretch"
        }}
      >
        <div
          style={{
            animation: "riseIn 760ms ease both",
            maxWidth: "41rem",
            paddingTop: "0.4rem"
          }}
        >
          <span className="eyebrow">AI For Architecture Teams</span>
          <h1
            style={{
              margin: "1rem 0 1.1rem",
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(3.2rem, 7vw, 6.1rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              maxWidth: "9ch",
              textWrap: "balance"
            }}
          >
            Your AI that already knows the project.
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "33rem",
              color: "var(--muted)",
              lineHeight: 1.72,
              fontSize: "1.08rem",
              textWrap: "pretty"
            }}
          >
            Architecture teams spend hours on emails, RFIs, and coordination that AI could handle
            if only AI understood the project. Heimdall reads your shared folders and builds that
            context automatically. Install once. Ask anything.
          </p>

          <div
            className="hero-actions"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.9rem",
              alignItems: "center",
              marginTop: "1.6rem"
            }}
          >
            <button className="button-primary" onClick={handleJoinWaitlist} type="button">
              {isTransitioning ? "Opening waitlist..." : "Join the waitlist - Free"}
            </button>
          </div>

          <p
            style={{
              margin: "0.85rem 0 0",
              color: "var(--muted)",
              lineHeight: 1.7
            }}
          >
            No setup complexity. No prompt engineering.
          </p>
        </div>

        <div
          className="panel"
          style={{
            borderRadius: "34px",
            padding: "1.2rem",
            animation: "riseIn 760ms ease both",
            animationDelay: "140ms",
            minHeight: "100%",
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(255,251,245,0.9) 0%, rgba(244,236,224,0.82) 100%)"
          }}
        >
          <div
            style={{
              borderRadius: "28px",
              padding: "1.2rem",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,242,233,0.88) 100%)",
              border: "1px solid rgba(51,42,32,0.1)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                padding: "0.25rem 0.25rem 1rem",
                marginBottom: "0.15rem",
                borderBottom: "1px solid rgba(51,42,32,0.08)"
              }}
            >
              <div
                style={{
                  color: "var(--accent-strong)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginBottom: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em"
                }}
              >
                Why Heimdall
              </div>
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.6,
                  color: "var(--text)",
                  fontSize: "1.12rem",
                  fontWeight: 500,
                  textWrap: "pretty"
                }}
              >
                Other AI tools are smart. <em>They just do not know your project.</em>
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "0.85rem",
                flex: 1
              }}
            >
              {[
                [
                  "01",
                  "Install & Connect",
                  "Point Heimdall at the shared folder your team already uses. Everything runs locally, and your files never leave your machine."
                ],
                [
                  "02",
                  "Log as you work",
                  "When you update a file, tap one button to say why. Heimdall turns that into project memory without forms or manual tagging."
                ],
                [
                  "03",
                  "Ask anything",
                  "Your team gets an AI that already knows the revisions, decisions, and reasons behind the work, with answers in seconds."
                ]
              ].map(([step, label, text]) => (
                <div
                  key={step}
                  style={{
                    padding: "1rem 1rem 1.05rem",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(21,73,63,0.08)",
                    boxShadow:
                      "0 10px 28px rgba(50,37,20,0.04), inset 0 1px 0 rgba(255,255,255,0.75)",
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
                      background: "linear-gradient(180deg, #1e6b5c 0%, #15493f 100%)",
                      color: "#f8f4ec",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      boxShadow: "0 10px 18px rgba(21,73,63,0.16)"
                    }}
                  >
                    {step}
                  </div>
                  <div>
                    <div
                      style={{
                        color: "var(--text)",
                        fontSize: "1.02rem",
                        fontWeight: 700,
                        marginBottom: "0.3rem",
                        lineHeight: 1.3
                      }}
                    >
                      {label}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(26,24,20,0.74)",
                        lineHeight: 1.7,
                        textWrap: "pretty"
                      }}
                    >
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "0.95rem",
                padding: "1.15rem 1.2rem",
                borderRadius: "24px",
                background: "rgba(16, 36, 32, 0.93)",
                color: "#f8f4ec",
                boxShadow: "0 18px 36px rgba(16,36,32,0.14)"
              }}
            >
              <div
                style={{
                  color: "rgba(248,244,236,0.72)",
                  marginBottom: "0.45rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.78rem",
                  fontWeight: 700
                }}
              >
                Setup reality
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.08rem",
                  lineHeight: 1.7,
                  fontWeight: 500,
                  textWrap: "pretty"
                }}
              >
                Works on folders you already use. No IT setup required, no prompt engineering, and
                no new system for the team to learn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
