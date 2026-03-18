import { NextResponse } from "next/server";

import { appendWaitlistRow } from "@/lib/google-sheets";
import { waitlistSchema } from "@/lib/waitlist-schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please provide a valid company, role, and work email."
        },
        { status: 400 }
      );
    }

    await appendWaitlistRow({
      ...parsed.data,
      source: "landing-page"
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while saving your request.";

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}

