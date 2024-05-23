import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { userId } = auth();
  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const department = await db.department.findMany({
      where: {
        title: {
          not: "BOD",
        },
      },
    });
    return NextResponse.json(department);
  } catch (error) {
    console.log("DEPARTMENT_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(req: Request) {
  const { userId } = auth();
  const { title } = await req.json();
  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const department = await db.department.create({
      data: {
        title,
      },
    });
    return NextResponse.json(department);
  } catch (error) {
    console.log("DEPARTMENT_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
