import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

import { clerkClient } from "@clerk/nextjs";

export async function GET(req: Request) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const instructors = await db.user.findMany({
      where: {
        userPermission: {
          some: {
            permission: {
              title: "Instruction permission",
            },
          },
        },
      },
    });
    return NextResponse.json(instructors);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
