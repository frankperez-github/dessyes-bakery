import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Insert order into the PostgreSQL database
        const { error } = await supabase
        .from('OrderProducts')
        .insert(body);

        if (error) {
        console.error("Error inserting order:", error);
        return NextResponse.json({ error: "Failed to insert order" }, { status: 500 });
        }

        // Return a success message without any specific data
        return NextResponse.json({ message: "Order inserted successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}