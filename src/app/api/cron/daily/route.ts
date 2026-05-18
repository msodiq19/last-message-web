import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
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

  const supabase = createServiceClient() as SupabaseClient<Database>;
  const now = new Date();

  // Fetch all active messages with their recipients
  const { data: messages, error } = await supabase
    .from("messages")
    .select(`
      *,
      message_recipients (
        id, status, handshake_token,
        successors ( name, email )
      )
    `)
    .eq("status", "active");

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
    const lastCheckinDate = new Date(msg.last_checkin);
    const nowDate = new Date(now.toISOString().split("T")[0]);
    const checkinDate = new Date(lastCheckinDate.toISOString().split("T")[0]);
    const daysSinceCheckin = Math.floor(
      (nowDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // --- Release (idempotent) ---
    if (daysSinceCheckin >= msg.release_after) {
      const { data: updated } = await supabase
        .from("messages")
        .update({
          status: "released",
          released_at: now.toISOString(),
        })
        .eq("id", msg.id)
        .eq("status", "active")
        .select("id")
        .single();

      if (!updated) continue;

      // Extract all successors and send individual URLs
      if (msg.message_recipients && msg.message_recipients.length > 0) {
        for (const recipient of msg.message_recipients) {
          const successorEmail = (recipient as any).successors?.email;
          if (!successorEmail) continue;

          const readUrl = `${baseUrl}/read/${recipient.id}`;
          const { success } = await sendReleaseEmail(successorEmail, readUrl);
          if (!success) {
            console.error(`Release email failed for recipient ${recipient.id}`);
          }
        }
      }

      results.releases++;
      continue;
    }

    // --- Reminders ---
    if (msg.email_invalid) continue;

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
        break;
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
