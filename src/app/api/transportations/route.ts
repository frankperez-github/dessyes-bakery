import { db } from "../../database/db";
import {default as Transportations} from "../../models/Transportation";

  

export async function GET(req:Request)
{
    await db.connect();
    const transportations = await Transportations.find({});
    await db.disconnect();
    return Response.json({
        transportations
    });
}

export async function POST(req:Request)
{
    await db.connect();
    const body = await req.json()
    const transportations = await Transportations.insertMany(body);
    await db.disconnect();
    return Response.json({
        transportations
    });
}