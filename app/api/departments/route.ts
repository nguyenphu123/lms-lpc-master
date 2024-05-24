import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { userId } = auth();
  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const department = await db.department.findMany({});
    return NextResponse.json(department);
  } catch (error) {
    console.log("DEPARTMENT_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}