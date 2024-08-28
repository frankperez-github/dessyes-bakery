import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
    try {
      // Extract the orderId from the request URL
      const { orderId } = params;
  
      if (!orderId) {
        return NextResponse.json({ error: "orderId is required" }, { status: 400 });
      }
  
      // Fetch all orderProducts with the specified orderId from the PostgreSQL database
      const { data: orderProducts, error } = await supabase
        .from('OrderProducts')
        .select('*')
        .eq('orderId', orderId);
  
      if (error) {
        console.error("Error fetching orderProducts:", error);
        return NextResponse.json({ error: "Failed to fetch orderProducts: " + error.message }, { status: 500 });
      }
  
      // Return the orderProducts as a JSON response
      return NextResponse.json({ orderProducts });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }