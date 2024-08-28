import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(req: NextRequest) {
  try {
    // Fetch all orders from the PostgreSQL database
    const { data: orders, error } = await supabase
      .from('Orders')
      .select('*');

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Failed to fetch orders "+error.message }, { status: 500 });
    }
    // Return the orders as a JSON response
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Insert order into the PostgreSQL database and return the inserted ID
    const { data: order, error } = await supabase
      .from('Orders')
      .insert(body)
      .select('id'); // Select the 'id' of the inserted order

    if (error) {
      console.error("Error inserting order:", error);
      return NextResponse.json({ error: "Failed to insert order" }, { status: 500 });
    }

    if (order && order.length > 0) {
      const orderId = order[0].id; // Get the ID of the inserted order
      // Return the inserted order ID as a JSON response
      return NextResponse.json({ orderId }, {status: 201});
    } else {
      return NextResponse.json({ error: "Order insertion failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
