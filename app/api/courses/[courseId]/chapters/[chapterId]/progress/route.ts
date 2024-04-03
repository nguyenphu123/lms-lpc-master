import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { progress, status, endDate } = await req.json();
    console.log(userId);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const year = new Date();
    const date = new Date(year.getFullYear(), 6, 1).toISOString();
    const userProgress = await db.userProgress.upsert({
      where: {
        moduleId_userId: {
          userId,
          moduleId: params.chapterId,
        },
      },
      update: {
        progress,
        status,
        endDate,
        attempt: {
          increment: 1,
        },
      },
      create: {
        userId,
        moduleId: params.chapterId,
        progress,
        status,
        startDate: date,
        attempt: 0,
      },
    });

    return NextResponse.json("update complete");
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    let lastDay: any = Date.now() - 24 * 60 * 60 * 1000;
    lastDay = new Date(lastDay).toISOString();
    const userProgress = await db.userProgress.findMany({
      where: {
        userId,
        moduleId: params.chapterId,
        status: {
          not: "finished",
        },
        endDate: {
          gte: lastDay,
        },
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
