import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(req: NextRequest, { params }: { params: { filename: string } }, res: NextApiResponse) {
  const { filename } = params;

  if (!filename || typeof filename !== "string") {
    return res.status(400).json({ error: "Filename is required and must be a string" });
  }

  try {
    // Define your bucket name
    const bucketName = "images";

    // Download file from Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filename);

    if (error) {
      console.error("Error downloading file:", error.message);
      return res.status(404).json({ error: "File does not exist" });
    }

    // Read the data as a buffer
    const buffer = await data.arrayBuffer();

    // Set appropriate headers
    res.setHeader("Content-Type", data.type || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", Buffer.byteLength(buffer));

    // Send the buffer as response
    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Server error" });
  }
}
