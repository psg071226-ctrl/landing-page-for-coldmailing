import { AnalyticsTracker } from "@/components/analytics-tracker";
import { HeroSection } from "@/components/hero-section";
import { InterestCountCopy } from "@/components/interest-count-copy";
import Link from "next/link";

const proofPoints = [
  "Hours lost every week on status emails, RFI drafts, and coordination updates that AI could help with if it knew the project.",
  "Project context lives across drawings, specs, change orders, meeting notes, chats, and inboxes.",
  "AI can draft text, but it cannot explain why the curtain wall spec changed last Tuesday without project memory.",
  "Every new tool and every new team member forces you to explain the same project all over again."
];

const workflow = [
  {
    title: "Install & Connect",
    description:
      "Point Heimdall at the shared folder your team already uses. Everything runs locally, and your files never leave your machine."
  },
  {
    title: "Log as you work",
    description:
      "When you update a file, tap one button to say why. It takes seconds, and Heimdall handles the rest."
  },
  {
    title: "Ask anything",
    description:
      "Get an AI that already knows the project, including revisions, decisions, and the reasons behind them."
  }
];

const sectionHeadingStyles = {
  fontFamily: "var(--font-display), serif",
  fontSize: "clamp(1.5rem, 3vw, 3rem)",
  lineHeight: 0.98,
  letterSpacing: "-0.03em",
  textWrap: "balance",
  maxWidth: "11.5ch"
} as const;

const centeredSectionWidth = {
  width: "100%"
} as const;

const featurePills = [
  {
    title: "Runs locally",
    description: "Your data stays yours."
  },
  {
    title: "Works on your folders",
    description: "No migration or new structure."
  },
  {
    title: "No prompt engineering",
    description: "The project context is already there."
  },
  {
    title: "Ready from day one",
    description: "Useful as soon as you connect it."
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
            ...centeredSectionWidth,
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            alignItems: "stretch"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              minHeight: "100%",
              padding: "0.25rem 0"
            }}
          >
            <div>
              <span className="eyebrow">Why It Matters</span>
              <h2
                style={{
                  ...sectionHeadingStyles,
                  margin: "1rem 0 0",
                  maxWidth: "none"
                }}
              >
                Point it at your folder. That&apos;s basically it.
              </h2>
            </div>
            <p
              style={{
                maxWidth: "38rem",
                margin: "0.9rem 0 0",
                color: "var(--muted)",
                lineHeight: 1.8,
                fontSize: "1.02rem"
              }}
            >
              Heimdall plugs into the folder structure your team already uses, logs why changes
              happened as you work, and gives everyone an AI that can answer with full project
              context.
            </p>
          </div>

          <div
            className="panel"
            style={{
              borderRadius: "30px",
              padding: "1.4rem",
              background:
                "linear-gradient(180deg, rgba(255,251,245,0.92) 0%, rgba(248,240,229,0.78) 100%)",
              display: "flex",
              minHeight: "100%"
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "1rem",
                alignContent: "space-between",
                width: "100%"
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
          className="feature-grid"
          style={{
            ...centeredSectionWidth,
            display: "grid",
            gap: "1.35rem",
            gridTemplateColumns: "minmax(0, 1fr)",
            alignItems: "stretch",
            marginBottom: "1.5rem"
          }}
        >
          <div
            className="panel"
            style={{
              borderRadius: "34px",
              padding: "1.7rem",
              display: "grid",
              gap: "1.2rem"
            }}
          >
            <div>
              <span className="eyebrow">The Outcome</span>
              <h2
                style={{
                  ...sectionHeadingStyles,
                  margin: "1rem 0 0.75rem",
                  maxWidth: "24ch"
                }}
              >
                Open Heimdall.
                <br />
                Get an answer in seconds.
              </h2>
              <p style={{ margin: 0, lineHeight: 1.8, color: "var(--muted)" }}>
                No folder digging. No calling the engineer. No reconstructing context from memory.
              </p>
            </div>

            <div
              style={{
                borderRadius: "28px",
                background: "rgba(16, 36, 32, 0.93)",
                color: "#f8f4ec",
                padding: "1.4rem"
              }}
            >
              <p style={{ margin: "0 0 0.85rem", color: "rgba(248,244,236,0.72)" }}>
                User
              </p>
              <p style={{ margin: 0, lineHeight: 1.8, fontSize: "1.04rem" }}>
                &quot;I&apos;m joining this project next week. Where are we right now? Any recent
                structural changes I should know about?&quot;
              </p>
              <div
                style={{
                  height: "1px",
                  background: "rgba(248,244,236,0.14)",
                  margin: "1rem 0"
                }}
              />
              <p style={{ margin: "0 0 0.85rem", color: "rgba(248,244,236,0.72)" }}>
                Heimdall
              </p>
              <p style={{ margin: 0, lineHeight: 1.8, textWrap: "pretty" }}>
                Currently in SD, targeting permit submission by April 14. On the structural side,
                Level 3 framing switched from aluminum to steel on Oct 9 in{" "}
                <strong>L3_Framing_Rev6.dwg</strong> after the engineer flagged deflection issues.
                The client approved the change in the Oct 2 meeting, and the +$42K budget impact is
                already reflected in the cost tracker. No structural changes since.
              </p>
            </div>
          </div>

          <div
            className="panel"
            style={{
              borderRadius: "34px",
              padding: "1.7rem",
              display: "grid",
              gap: "1rem",
              alignContent: "start"
            }}
          >
            <div>
              <span className="eyebrow">Why It Matters</span>
              <h2
                style={{
                  ...sectionHeadingStyles,
                  margin: "1rem 0 0.75rem",
                  maxWidth: "none"
                }}
              >
                <span style={{ display: "block", whiteSpace: "nowrap" }}>
                  The reason your team is not using AI
                </span>
                <span style={{ display: "block", whiteSpace: "nowrap" }}>
                  for project work yet.
                </span>
              </h2>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.8 }}>
                It is not that the tools are not capable. Your project context is too large, too
                scattered, and too complex to explain every time you open a chat window. Heimdall
                builds that memory automatically from the files and decisions your team already
                creates every day.
              </p>
            </div>

            <div
              className="hero-card-grid"
              style={{
                display: "grid",
                gap: "0.8rem",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
              }}
            >
              {featurePills.map((item) => (
                <div
                  key={item.title}
                  style={{
                    minHeight: "5.25rem",
                    padding: "0.95rem 1rem",
                    borderRadius: "18px",
                    background: "rgba(255,255,255,0.78)",
                    border: "1px solid rgba(21,73,63,0.1)",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "0.75rem",
                    alignItems: "start",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.38)"
                  }}
                >
                  <div
                    style={{
                      width: "0.7rem",
                      height: "0.7rem",
                      marginTop: "0.35rem",
                      borderRadius: "999px",
                      background: "var(--accent)",
                      boxShadow: "0 0 0 6px rgba(30, 107, 92, 0.1)"
                    }}
                  />
                  <div>
                    <div
                      style={{
                        color: "var(--text)",
                        fontWeight: 600,
                        lineHeight: 1.35,
                        marginBottom: "0.18rem"
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        lineHeight: 1.5
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="panel cta-grid"
          style={{
            ...centeredSectionWidth,
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
                ...sectionHeadingStyles,
                margin: "1rem 0 0.5rem",
                maxWidth: "none"
              }}
            >
              Your team is already doing the work.
              <br />
              Now let AI use it.
            </h2>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--muted)" }}>
              Heimdall launches <strong>March 29</strong>. Join the waitlist now and get your
              first month free. {` `}
              <InterestCountCopy />
            </p>
          </div>

          <Link className="button-primary" href="/waitlist">
            Join the waitlist
          </Link>
        </div>
      </section>
    </main>
  );
}
