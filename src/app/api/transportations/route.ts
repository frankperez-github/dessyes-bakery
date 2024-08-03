import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(req: NextRequest) {
  try {
    // Fetch all transportation records from the PostgreSQL database
    const { data: transportations, error } = await supabase
      .from('Transportations')
      .select('*');

    if (error) {
      console.error("Error fetching transportations:", error.message);
      return NextResponse.json({ error: "Failed to fetch transportations" }, { status: 500 });
    }

    // Return the transportation records as a JSON response
    return NextResponse.json({ transportations });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ensure the body is in an array format to insert multiple records
    const records = Array.isArray(body) ? body : [body];

    // Insert new transportation records into the PostgreSQL database
    const { data: transportations, error } = await supabase
      .from('Transportations')
      .insert(records);

    if (error) {
      console.error("Error inserting transportations:", error.message);
      return NextResponse.json({ error: "Failed to insert transportations" }, { status: 500 });
    }

    // Return the inserted transportation records as a JSON response
    return NextResponse.json({ transportations });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
