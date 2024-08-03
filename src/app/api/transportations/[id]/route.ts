import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Fetch a single transportation record by ID
    const { data: transportation, error } = await supabase
      .from('Transportations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching transportation:", error.message);
      return NextResponse.json({ error: "Transportation not found" }, { status: 404 });
    }

    // Return the transportation record as a JSON response
    return NextResponse.json({ transportation });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await req.json();

    // Update transportation record by ID
    const { data: transportation, error } = await supabase
      .from('Transportations')
      .update(body)
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error updating transportation:", error.message);
      return NextResponse.json({ error: "Failed to update transportation" }, { status: 500 });
    }

    // Return the updated transportation record as a JSON response
    return NextResponse.json({ transportation });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Delete transportation record by ID
    const { data: transportation, error } = await supabase
      .from('Transportations')
      .delete()
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error deleting transportation:", error.message);
      return NextResponse.json({ error: "Failed to delete transportation" }, { status: 500 });
    }

    // Return the deleted transportation record as a JSON response
    return NextResponse.json({ transportation });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
