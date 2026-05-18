import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { sha256 } from "@/lib/hash";

export async function GET(request: NextRequest) {
  const ct = request.nextUrl.searchParams.get("ct");

  if (!ct) {
    return NextResponse.json(
      { error: "Missing check-in token" },
      { status: 400 }
    );
  }

  // The legacy ct_hash URL-based checkins have been deprecated for security
  // Active users must check-in natively through the Zero-Knowledge authenticated dashboard
  return NextResponse.json(
    { error: "Legacy email check-ins are deactivated. Please log in to your dashboard to check in securely." },
    { status: 410 }
  );
}
