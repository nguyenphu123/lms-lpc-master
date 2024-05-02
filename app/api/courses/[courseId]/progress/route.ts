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

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const year = new Date();
    const date = new Date();
    const userProgress = await db.classSessionRecord.upsert({
      where: {
        courseId_userId: {
          userId,
          courseId: params.courseId,
        },
      },
      update: {
        progress,
        status,
        endDate,
      },
      create: {
        userId,
        courseId: params.courseId,
        progress,
        status,
        startDate: date,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProgress = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        ClassSessionRecord: { include: { user: true } },
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
