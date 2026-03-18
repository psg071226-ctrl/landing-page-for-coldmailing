"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { SiteLogo } from "@/components/site-logo";

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
            paddingTop: "0.4rem",
            display: "flex",
            flexDirection: "column",
            minHeight: "100%"
          }}
        >
          <span className="eyebrow">AI For Architecture Teams</span>
          <h1
            style={{
              margin: "1rem 0 1.1rem",
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(3.2rem, 7vw, 6.1rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
              maxWidth: "9ch",
              textWrap: "balance"
            }}
          >
            Keep project context with every file change.
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
            Heimdall helps architecture teams track what changed, why it changed, and what that
            means later.
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
              fontWeight: 600,
              lineHeight: 1.6
            }}
          >
            {isLoadingCount ? "Loading interest..." : null}
            {!isLoadingCount
              ? `${interestCount} users are already interested in Project Heimdall.`
              : null}
          </p>
        </div>

        <div
          className="panel"
          style={{
            borderRadius: "34px",
            padding: "1.15rem",
            animation: "riseIn 760ms ease both",
            animationDelay: "140ms",
            minHeight: "100%",
            display: "flex"
          }}
        >
          <div
            style={{
              borderRadius: "28px",
              padding: "1.15rem",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.74) 0%, rgba(246,239,227,0.68) 100%)",
              border: "1px solid rgba(51,42,32,0.08)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <div
              className="hero-card-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "0.7rem",
                alignItems: "stretch"
              }}
            >
              {[
                ["Problem", "Project files keep changing, but the reason behind changes gets lost."],
                ["Product", "Heimdall gives teams a simple record of what changed and why."],
                ["Outcome", "Teams onboard faster and AI can answer with real context."]
              ].map(([label, text]) => (
                <div
                  key={label}
                  style={{
                    padding: "1rem 0.95rem",
                    borderRadius: "22px",
                    background: "rgba(255,255,255,0.72)",
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.86rem",
                      marginBottom: "0.45rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}
                  >
                    {label}
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.62, textWrap: "pretty" }}>{text}</p>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "0.85rem",
                padding: "1.15rem 1.2rem",
                borderRadius: "24px",
                background: "rgba(16, 36, 32, 0.93)",
                color: "#f8f4ec"
              }}
            >
              <div style={{ color: "rgba(248,244,236,0.72)", marginBottom: "0.4rem" }}>
                Why teams care
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.08rem",
                  lineHeight: 1.65,
                  textWrap: "pretty"
                }}
              >
                Instead of digging through folders, chats, and calls, teams can see the decision
                history in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
