import { db } from "../../../database/db";
import {default as Transportations} from "../../../models/Transportation";


export async function GET(req:any, {params}:any)
{
    const { id } = params;
    await db.connect();
    const transportation = await Transportations.findById(id)
    await db.disconnect();
    return Response.json({ transportation });
}

export async function PUT(req:any, {params}:any)
{
    const { id } = params;
    await db.connect();
    const body = await req.json()
    const transportation = await Transportations.findByIdAndUpdate(id, body);
    await db.disconnect();
    return Response.json({ transportation });
}

export async function DELETE(req:any, {params}:any)
{
    const { id } = params;
    await db.connect();
    const transportation = await Transportations.findByIdAndDelete(id);
    await db.disconnect();
    return Response.json({ transportation });
}