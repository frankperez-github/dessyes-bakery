import { db } from "../../database/db";
import { Readable } from "stream";
import {default as Products} from "../../models/Product";
import { NextRequest } from "next/server";
  

export async function GET(req:Request)
{
    await db.connect();
    const products = await Products.find({});
    await db.disconnect();
    return Response.json({
        products
    });
}

type FormDataObject = {
    [key: string]: string | File;
  };

export async function POST(req:NextRequest)
{
    const {client, bucket} = await db.connect();
    const body = await req.formData()
    console.log(body)
    let image = "";
    for (const entries of Array.from(body.entries())) {
        const [key, value] = entries;
        
        if (typeof value == "object") {
            image = Date.now() + value.name;
            const buffer = Buffer.from(await value.arrayBuffer());
            const stream = Readable.from(buffer);
            const uploadStream = bucket.openUploadStream(image, {});
            const uploadStartTime = Date.now();
            await new Promise((resolve, reject) => {
                stream.pipe(uploadStream)
                    .on('error', reject)
                    .on('finish', resolve);
            });
            const uploadEndTime = Date.now();
            const uploadTime = uploadEndTime - uploadStartTime;
        }
    }
    
    body.set("image", image);

    const formDataObject:FormDataObject = {};
    for (const [key, value] of  Array.from(body.entries())) {
        formDataObject[key] = value;
    }
    const products = await Products.insertMany(formDataObject);
    await db.disconnect();
    return Response.json({
        products
    });
}