import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(req: NextRequest) {
  try {
    // Fetch all paymentStatus from the PostgreSQL database
    const { data: paymentStatus, error } = await supabase
      .from('PaymentStatus')
      .select('*');

    if (error) {
      console.error("Error fetching paymentStatus:", error);
      return NextResponse.json({ error: "Failed to fetch paymentStatus "+error.message }, { status: 500 });
    }
    // Return the paymentStatus as a JSON response
    return NextResponse.json({ paymentStatus });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}