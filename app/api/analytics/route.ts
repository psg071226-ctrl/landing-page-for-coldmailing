import { NextResponse } from "next/server";
import { z } from "zod";

import { incrementDailyMetric } from "@/lib/google-sheets";

const analyticsSchema = z.object({
  event: z.enum(["visit", "cta_click", "conversion"])
});

const eventToMetric = {
  visit: "unique_visits",
  cta_click: "cta_clicks",
  conversion: "waitlist_conversions"
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = analyticsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unsupported analytics event."
        },
        { status: 400 }
      );
    }

    await incrementDailyMetric(eventToMetric[parsed.data.event]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to store analytics right now.";

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
