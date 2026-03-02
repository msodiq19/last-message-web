import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing message ID" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("messages")
    .select("encrypted_blob")
    .eq("id", id)
    .eq("status", "released")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Message not found or not yet released" },
      { status: 404 }
    );
  }

  return NextResponse.json({ encrypted_blob: data.encrypted_blob });
}
