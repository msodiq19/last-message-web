import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
        .from("vault_items")
        .select("encrypted_content, encrypted_fragment_a, secret_question")
        .eq("id", id)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: "Vault not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}
