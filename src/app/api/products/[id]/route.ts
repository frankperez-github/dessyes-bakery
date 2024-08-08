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
    // Fetch product by ID from the PostgreSQL database
    const { data: product, error } = await supabase
      .from('Products')
      .select('*')
      .eq('id', id)
      .single(); // Retrieve a single product

    if (error) {
      console.error("Error fetching product:", error.message);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Return the product as a JSON response
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await req.formData();

    let imageUrl = "";
    let formDataObject: any = {};

    // Fetch the existing product data
    const { data: existingProduct, error: fetchError } = await supabase
      .from('Products')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Error fetching product:", fetchError);
      return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }

    // Process the incoming form data
    for (const [key, value] of Array.from(body.entries())) {
      if (typeof value === "object" && value instanceof File) {
        if (value.name) { // Check if an image was actually provided
          const imageName = Date.now() + "-" + value.name;

          const { data, error: uploadError } = await supabase.storage
            .from("images")
            .upload(imageName, value);

          if (uploadError) {
            console.error("Error uploading file:", uploadError.message);
            return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
          }

          const { data: urlData } = supabase.storage
            .from("images")
            .getPublicUrl(imageName);

          formDataObject.image = urlData.publicUrl; // Set the new image URL
        }
      } else {
        formDataObject[key] = value as string;
      }
    }

    // Merge existing product data with the new data
    const updatedProduct = {
      ...existingProduct,
      ...formDataObject,
    };

    const { data: product, error: updateError } = await supabase
      .from('Products')
      .update(updatedProduct)
      .eq('id', id)
      .single();

    if (updateError) {
      console.error("Error updating product:", updateError);
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }

    return NextResponse.json({ product });
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
      .remove([product.image]);

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
