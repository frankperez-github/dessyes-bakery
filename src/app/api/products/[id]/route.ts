import { db } from "../../../database/db";
import {default as Products} from "../../../models/Product";


export async function GET(req:any, {params}:any)
{
    const { id } = params;
    await db.connect();
    const product = await Products.findById(id)
    await db.disconnect();
    return Response.json({ product });
}

export async function PUT(req:any, {params}:any)
{
    const { id } = params;
    await db.connect();
    const body = await req.json()
    const product = await Products.findByIdAndUpdate(id, body);
    await db.disconnect();
    return Response.json({ product });
}

export async function DELETE(req:any, {params}:any)
{
    const { id } = params;
    await db.connect();
    const product = await Products.findByIdAndDelete(id);
    await db.disconnect();
    return Response.json({ product });
}