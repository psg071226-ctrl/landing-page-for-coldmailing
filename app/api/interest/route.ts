import { NextRequest, NextResponse } from "next/server";

import { getInterestCounter, registerInterestByIp } from "@/lib/google-sheets";

const VISITOR_COOKIE = "heimdall_visitor_id";

function getClientIp(request: NextRequest) {
  const cloudflareIp = request.headers.get("cf-connecting-ip");

  if (cloudflareIp) {
    return cloudflareIp.trim();
  }

  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  const flyIp = request.headers.get("fly-client-ip");

  if (flyIp) {
    return flyIp.trim();
  }

  const vercelIp = request.headers.get("x-vercel-forwarded-for");

  if (vercelIp) {
    return vercelIp.split(",")[0]?.trim() || "unknown";
  }

  return "unknown";
}

function getClientIdentifier(request: NextRequest) {
  const ip = getClientIp(request);

  if (ip && ip !== "unknown") {
    return {
      identifier: `ip:${ip}`,
      needsCookie: false,
      cookieValue: ""
    };
  }

  const existingVisitorId = request.cookies.get(VISITOR_COOKIE)?.value;

  if (existingVisitorId) {
    return {
      identifier: `visitor:${existingVisitorId}`,
      needsCookie: false,
      cookieValue: existingVisitorId
    };
  }

  const visitorId = crypto.randomUUID();

  return {
    identifier: `visitor:${visitorId}`,
    needsCookie: true,
    cookieValue: visitorId
  };
}

export async function GET(request: NextRequest) {
  try {
    const client = getClientIdentifier(request);
    const { count, alreadyCounted } = await getInterestCounter(client.identifier);

    const response = NextResponse.json({
      ok: true,
      count,
      alreadyCounted
    });

    if (client.needsCookie) {
      response.cookies.set(VISITOR_COOKIE, client.cookieValue, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 365
      });
    }

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to read the interest counter.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
        count: 50
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = getClientIdentifier(request);
    const result = await registerInterestByIp(client.identifier);

    const response = NextResponse.json({
      ok: true,
      count: result.count,
      alreadyCounted: result.alreadyCounted
    });

    if (client.needsCookie) {
      response.cookies.set(VISITOR_COOKIE, client.cookieValue, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 365
      });
    }

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update the interest counter.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
        count: 50
      },
      { status: 500 }
    );
  }
}
