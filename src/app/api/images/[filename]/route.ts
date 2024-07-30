import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database/db";

export async function GET(req: any, { params }: any) {
  const { filename } = params;
  
  if (!filename || typeof filename !== "string") {
    return new Response(JSON.stringify({ error: "Filename is required and must be a string" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { bucket } = await db.connect();

    const files = await bucket.find({ filename }).toArray();

    if (files.length === 0) {
      return new Response(JSON.stringify({ error: "File does not exist" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const file = files[0];
    const stream = bucket.openDownloadStreamByName(file.filename);

    const headers = new Headers();
    headers.set("Content-Type", file.contentType || "application/octet-stream");

    const readableStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });

        stream.on("end", () => {
          controller.close();
        });

        stream.on("error", (error) => {
          console.error("Stream error:", error);
          controller.error(error);
        });
      }
    });

    return new Response(readableStream, { headers });
  } catch (error) {
    console.error("Error finding files:", error);
  }
}
