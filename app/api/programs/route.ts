import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId, sessionClaims }: any = auth();
    let userInfo: any = await db.user.findUnique({
      where: { id: userId, status: "approved" },
    });

    const programs = await db.program.findMany();

    return NextResponse.json(programs);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const { userId, sessionClaims }: any = auth();
    const { title } = await req.json();
    let userInfo: any = await db.user.findUnique({
      where: { id: userId, status: "approved" },
    });

    const date = new Date();
    const program = await db.program.create({
      data: {
        userId,
        title,
        isPublished: false,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
