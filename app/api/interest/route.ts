import { NextRequest, NextResponse } from "next/server";

import { getInterestCounter, registerInterestByIp } from "@/lib/google-sheets";

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { count, alreadyCounted } = await getInterestCounter(ip);

    return NextResponse.json({
      ok: true,
      count,
      alreadyCounted
    });
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
    const ip = getClientIp(request);
    const result = await registerInterestByIp(ip);

    return NextResponse.json({
      ok: true,
      count: result.count,
      alreadyCounted: result.alreadyCounted
    });
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
