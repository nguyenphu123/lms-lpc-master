import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const permission = await db.permission.create({
      data: {
        title,
      },
    });

    return NextResponse.json(permission);
  } catch (error) {
    console.log("[PERMISSION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const role = await db.permission.findMany({});
    return NextResponse.json(role);
  } catch (error) {
    console.log("[PERMISSION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
