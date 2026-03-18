"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

const DEFAULT_INTEREST_COUNT = 50;

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
  const [interestCount, setInterestCount] = useState(DEFAULT_INTEREST_COUNT);
  const [hasJoinedInterestCount, setHasJoinedInterestCount] = useState(false);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadInterestCount = async () => {
      try {
        const response = await fetch("/api/interest", {
          method: "GET",
          cache: "no-store"
        });

        const data = (await response.json()) as {
          ok: boolean;
          count?: number;
          alreadyCounted?: boolean;
        };

        if (!response.ok || !data.ok) {
          return;
        }

        if (!isMounted) {
          return;
        }

        setInterestCount(data.count ?? DEFAULT_INTEREST_COUNT);
        setHasJoinedInterestCount(Boolean(data.alreadyCounted));
      } catch {
        // Keep the landing page usable even if the counter cannot load.
      } finally {
        if (isMounted) {
          setIsLoadingCount(false);
        }
      }
    };

    void loadInterestCount();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleJoinWaitlist = async () => {
    if (isTransitioning) {
      return;
    }

    setIsTransitioning(true);

    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = (await response.json()) as {
        ok: boolean;
        count?: number;
        alreadyCounted?: boolean;
      };

      if (response.ok && data.ok) {
        setInterestCount(data.count ?? DEFAULT_INTEREST_COUNT);
        setHasJoinedInterestCount(Boolean(data.alreadyCounted));
      }
    } catch {
      // Keep the CTA flow smooth even if interest tracking fails.
    }

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
        <Link href="/" style={{ fontWeight: 600, letterSpacing: "0.03em" }}>
          Project Heimdall
        </Link>
        <Link className="button-secondary" href="/waitlist">
          Join waitlist
        </Link>
      </header>

      <div
        className="hero-grid"
        style={{
          display: "grid",
          gap: "1.6rem",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
          alignItems: "end"
        }}
      >
        <div style={{ animation: "riseIn 760ms ease both" }}>
          <span className="eyebrow">AI-Native Knowledge OS For Architecture</span>
          <h1
            style={{
              margin: "1rem 0 1rem",
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(3.4rem, 8vw, 7rem)",
              lineHeight: 0.9,
              maxWidth: "12ch"
            }}
          >
            Keep the why behind every project change.
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "38rem",
              color: "var(--muted)",
              lineHeight: 1.85,
              fontSize: "1.04rem"
            }}
          >
            Project Heimdall helps architecture teams turn fragmented files, revisions, and
            decisions into a structured knowledge base. The result is a clearer project record,
            faster onboarding, and AI that can answer with context instead of guesswork.
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
              {isTransitioning ? "Opening waitlist..." : "Join waitlist"}
            </button>
          </div>

          <p
            aria-live="polite"
            style={{
              margin: "1rem 0 0",
              color: "var(--accent-strong)",
              fontWeight: 600
            }}
          >
            {isLoadingCount ? "Loading interest..." : null}
            {!isLoadingCount
              ? `${interestCount} architecture teams are already interested in Project Heimdall.`
              : null}
          </p>
          {!isLoadingCount && hasJoinedInterestCount ? (
            <p
              style={{
                margin: "0.45rem 0 0",
                color: "var(--muted)",
                lineHeight: 1.7
              }}
            >
              This network has already been counted, so the number will not increase again here.
            </p>
          ) : null}
        </div>

        <div
          className="panel"
          style={{
            borderRadius: "34px",
            padding: "1.3rem",
            animation: "riseIn 760ms ease both",
            animationDelay: "140ms"
          }}
        >
          <div
            style={{
              borderRadius: "28px",
              padding: "1.3rem",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.74) 0%, rgba(246,239,227,0.68) 100%)",
              border: "1px solid rgba(51,42,32,0.08)"
            }}
          >
            <div
              className="hero-card-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "0.75rem"
              }}
            >
              {[
                ["Problem", "Design context disappears across files, comments, and memory."],
                ["Signal", "Teams need to revisit why decisions changed months later."],
                ["Outcome", "AI becomes useful when project history is structured."]
              ].map(([label, text]) => (
                <div
                  key={label}
                  style={{
                    padding: "1rem",
                    borderRadius: "22px",
                    background: "rgba(255,255,255,0.72)"
                  }}
                >
                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.86rem",
                      marginBottom: "0.45rem"
                    }}
                  >
                    {label}
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.65 }}>{text}</p>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "1rem",
                padding: "1.1rem",
                borderRadius: "24px",
                background: "rgba(16, 36, 32, 0.93)",
                color: "#f8f4ec"
              }}
            >
              <div style={{ color: "rgba(248,244,236,0.72)", marginBottom: "0.4rem" }}>
                Early concept
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.08rem",
                  lineHeight: 1.7
                }}
              >
                Heimdall is built to preserve version history, capture the reason behind changes,
                and prepare architecture projects for context-aware AI over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
