import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.encrypted_content || !body.encrypted_fragment_a || !body.secret_question) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const supabase = createServiceClient();

        const { data, error } = await supabase
            .from("vault_items")
            .insert({
                encrypted_content: body.encrypted_content,
                encrypted_fragment_a: body.encrypted_fragment_a,
                secret_question: body.secret_question,
            })
            .select("id")
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json(
                { error: "Failed to store vault item" },
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
