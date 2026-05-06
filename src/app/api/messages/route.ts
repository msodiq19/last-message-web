import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { sha256 } from "@/lib/hash";
import { MAX_MESSAGE_SIZE } from "@/lib/constants";
import type { CreateMessageRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateMessageRequest;

    if (!body.encrypted_blob || !body.ct_hash || !body.sender_email || !body.recipient_email || !body.secret_question || !body.encrypted_fragment_a) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.sender_email)) {
      return NextResponse.json(
        { error: "Invalid sender email address" },
        { status: 400 }
      );
    }
    if (!emailRegex.test(body.recipient_email)) {
      return NextResponse.json(
        { error: "Invalid recipient email address" },
        { status: 400 }
      );
    }

    // Sender and recipient must be different
    if (body.sender_email.trim().toLowerCase() === body.recipient_email.trim().toLowerCase()) {
      return NextResponse.json(
        { error: "Sender and recipient email addresses cannot be the same" },
        { status: 400 }
      );
    }

    // Validate message size (encrypted_blob is base64url, ~33% overhead)
    if (body.encrypted_blob.length > MAX_MESSAGE_SIZE) {
      return NextResponse.json(
        { error: `Message too large. Maximum size is ${Math.floor(MAX_MESSAGE_SIZE / 1024)}KB.` },
        { status: 413 }
      );
    }

    // The ct_hash is already hashed client-side before sending
    // But we hash it again server-side for defense in depth
    const ctHashDouble = await sha256(body.ct_hash);

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("messages")
      .insert({
        encrypted_blob: body.encrypted_blob,
        ct_hash: ctHashDouble,
        sender_email: body.sender_email,
        recipient_email: body.recipient_email,
        secret_question: body.secret_question,
        encrypted_fragment_a: body.encrypted_fragment_a,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to store message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
