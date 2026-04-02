import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { sendReminderEmail, sendReleaseEmail } from "@/lib/email";
import { REMINDER_SCHEDULE, MAX_EMAIL_RETRIES } from "@/lib/constants";
import type { Message } from "@/types";

/**
 * Daily cron job: send reminders and release messages.
 * Protected by CRON_SECRET header.
 *
 * GET  /api/cron/daily — Vercel Cron (sends GET)
 * POST /api/cron/daily — External cron services (e.g. cron-job.org)
 * Header: Authorization: Bearer <CRON_SECRET>
 */
async function handleCron(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();

  // Fetch all active messages
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("status", "active")
    .returns<Message[]>();

  if (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }

  if (!messages || messages.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const results = { reminders: 0, releases: 0, errors: 0 };

  for (const msg of messages) {
    // Use date-only comparison to avoid clock skew / DST issues
    const lastCheckinDate = new Date(msg.last_checkin);
    const nowDate = new Date(now.toISOString().split("T")[0]);
    const checkinDate = new Date(lastCheckinDate.toISOString().split("T")[0]);
    const daysSinceCheckin = Math.floor(
      (nowDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // --- Release (idempotent) ---
    if (daysSinceCheckin >= msg.release_after) {
      // Atomic: only transition if still active (prevents duplicate releases)
      const { data: updated } = await supabase
        .from("messages")
        .update({
          status: "released" as const,
          released_at: now.toISOString(),
        })
        .eq("id", msg.id)
        .eq("status", "active")
        .select("id")
        .single();

      if (!updated) {
        // Already released by a prior run — skip, no-op
        continue;
      }

      const readUrl = `${baseUrl}/read/${msg.id}`;
      const { success } = await sendReleaseEmail(msg.recipient_email, readUrl);

      if (!success) {
        console.error(`Release email failed for message ${msg.id}, but message released anyway`);
      }

      results.releases++;
      continue;
    }

    // --- Reminders ---
    if (msg.email_invalid) continue; // No point sending to invalid email

    for (const schedule of REMINDER_SCHEDULE) {
      if (daysSinceCheckin === schedule.daysSinceCheckin) {
        const { success, hardBounce } = await sendReminderEmail(
          msg.sender_email,
          schedule.daysLeft
        );

        if (!success) {
          if (hardBounce) {
            await supabase
              .from("messages")
              .update({ email_invalid: true })
              .eq("id", msg.id);
          } else if (msg.retry_count < MAX_EMAIL_RETRIES) {
            await supabase
              .from("messages")
              .update({ retry_count: msg.retry_count + 1 })
              .eq("id", msg.id);
          }
          results.errors++;
        } else {
          results.reminders++;
        }
        break; // Only one reminder per day per message
      }
    }
  }

  return NextResponse.json({
    processed: messages.length,
    ...results,
    timestamp: now.toISOString(),
  });
}

// Vercel Cron sends GET requests
export async function GET(request: NextRequest) {
  return handleCron(request);
}

// External cron services (e.g. cron-job.org) send POST requests
export async function POST(request: NextRequest) {
  return handleCron(request);
}
