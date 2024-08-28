import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(req: NextRequest) {
  try {
    // Fetch all orderStatus from the PostgreSQL database
    const { data: orderStatus, error } = await supabase
      .from('OrderStatus')
      .select('*');

    if (error) {
      console.error("Error fetching orderStatus:", error);
      return NextResponse.json({ error: "Failed to fetch orderStatus "+error.message }, { status: 500 });
    }
    // Return the orderStatus as a JSON response
    return NextResponse.json({ orderStatus });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}