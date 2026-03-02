import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { sha256 } from "@/lib/hash";

export async function GET(request: NextRequest) {
  const ct = request.nextUrl.searchParams.get("ct");

  if (!ct) {
    return NextResponse.json(
      { error: "Missing check-in token" },
      { status: 400 }
    );
  }

  // Hash the token the same way it was stored:
  // Client hashed CT once before sending during creation,
  // then server hashed again. So here we hash raw CT once (client-side equivalent),
  // then hash that again (server-side equivalent).
  const ctHashOnce = await sha256(ct);
  const ctHashDouble = await sha256(ctHashOnce);

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("messages")
    .update({ last_checkin: new Date().toISOString() })
    .eq("ct_hash", ctHashDouble)
    .eq("status", "active")
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Invalid or expired check-in token" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: "Check-in confirmed" });
}
