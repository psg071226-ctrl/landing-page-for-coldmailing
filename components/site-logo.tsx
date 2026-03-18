import Link from "next/link";

type SiteLogoProps = {
  href?: string;
  compact?: boolean;
};

export function SiteLogo({ href = "/", compact = false }: SiteLogoProps) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        color: "#050607",
        lineHeight: 1,
        letterSpacing: "-0.04em"
      }}
    >
      <span
        aria-label="Heimdall"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: compact ? "0.18rem" : "0.28rem"
        }}
      >
        <span
          style={{
            fontSize: compact ? "2rem" : "3.2rem",
            fontWeight: 500
          }}
        >
          Heim
        </span>
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            display: "inline-grid",
            placeItems: "center",
            width: compact ? "2.3rem" : "3.5rem",
            height: compact ? "2.3rem" : "3.5rem",
            borderRadius: "50%",
            border: "1.5px solid #050607",
            flexShrink: 0
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: compact ? "0.14rem" : "0.18rem",
              borderRadius: "50%",
              border: "1px solid #050607"
            }}
          />
          <span
            style={{
              width: compact ? "0.66rem" : "0.92rem",
              height: compact ? "0.66rem" : "0.92rem",
              borderRadius: "50%",
              background: "#050607"
            }}
          />
        </span>
        <span
          style={{
            fontSize: compact ? "2rem" : "3.2rem",
            fontWeight: 500
          }}
        >
          dall
        </span>
      </span>
    </Link>
  );
}
