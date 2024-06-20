import { db } from "../../database/db";
import {default as Products} from "../../models/Product";

  

export async function GET(req:Request)
{
    await db.connect();
    const products = await Products.find({});
    await db.disconnect();
    return Response.json({
        products
    });
}

export async function POST(req:Request)
{
    await db.connect();
    const body = await req.json()
    const products = await Products.insertMany(body);
    await db.disconnect();
    return Response.json({
        products
    });
}