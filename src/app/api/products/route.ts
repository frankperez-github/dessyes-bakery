import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(req: NextRequest) {
  try {
    // Fetch all products from the PostgreSQL database
    const { data: products, error } = await supabase
      .from('Products')
      .select('*');

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    // Return the products as a JSON response
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

type FormDataObject = {
  [key: string]: string | File;
};

export async function POST(req: NextRequest) {
  try {
    // Parse form data from the request
    const body = await req.formData();

    let imageUrl = "";
    let formDataObject: FormDataObject = {};

    // Handle file upload
    for (const [key, value] of Array.from(body.entries())) {
      if (typeof value === "object") {
        const imageName = Date.now() + "-" + value.name;

        // Upload the file to Supabase storage
        const { data, error: uploadError } = await supabase.storage
          .from("images")
          .upload(imageName, value);

        if (uploadError) {
          console.error("Error uploading file:", uploadError.message);
          return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
        }

        // Construct the public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(imageName);

        imageUrl = urlData.publicUrl;
      } else {
        formDataObject[key] = value as string;
      }
    }

    // Add the image URL to the form data object
    formDataObject.image = imageUrl;

    // Insert product into the PostgreSQL database
    const { data: product, error } = await supabase
      .from('Products')
      .insert([formDataObject]);

    if (error) {
      console.error("Error inserting product:", error);
      return NextResponse.json({ error: "Failed to insert product" }, { status: 500 });
    }

    // Return the created product as a JSON response
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
