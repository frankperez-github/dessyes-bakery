import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
  const { orderId } = params;

  try {
    const body = await req.json();


    // Fetch the existing order data
    const { data: existingOrder, error: fetchError } = await supabase
      .from('Orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error("Error fetching order:", fetchError);
      return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }


    // Merge existing order data with the new data
    const updatedOrder = {
      ...existingOrder,
      ...body,
    };
    console.log(updatedOrder)

    const { data: order, error: updateError } = await supabase
      .from('Orders')
      .update(updatedOrder)
      .eq('id', orderId)
      .single();

    if (updateError) {
      console.error("Error updating order:", updateError);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Fetch the product to get the image filename
    const { data: product, error: fetchError } = await supabase
      .from('Products')
      .select('image')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Error fetching product for deletion:", fetchError.message);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the image file from Supabase storage
    const { error: deleteFileError } = await supabase.storage
      .from('images')
      .remove([product?.image]);

    if (deleteFileError) {
      console.error("Error deleting image file:", deleteFileError.message);
      return NextResponse.json({ error: "Failed to delete image file" }, { status: 500 });
    }

    // Delete product by ID from the PostgreSQL database
    const { data: deletedProduct, error: deleteProductError } = await supabase
      .from('Products')
      .delete()
      .eq('id', id)
      .single();

    if (deleteProductError) {
      console.error("Error deleting product:", deleteProductError.message);
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }

    // Return the deleted product as a JSON response
    return NextResponse.json({ product: deletedProduct });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
