import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const role = await db.role.create({
      data: {
        title: title.toUpperCase(),
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    console.log("[ROLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const role = await db.role.findMany({});
    return NextResponse.json(role);
  } catch (error) {
    console.log("[ROLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
