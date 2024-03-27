import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims }: any = auth();
    const { title } = await req.json();

    if (!userId || sessionClaims.userInfo.role.toUpperCase() == "STAFF") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const date = new Date();
    const course = await db.course.create({
      data: {
        userId,
        title,
        startDate: date,
        isPublished: false,
        Module: {
          create: [
            {
              position: 1,
              isPublished: false,
              title: "Intro",
              type: "slide",
              userId,
            },
          ],
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
