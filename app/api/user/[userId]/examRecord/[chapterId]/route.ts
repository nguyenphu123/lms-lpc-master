import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { userId: string; chapterId: string } }
) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log(params.userId);
    console.log(params.chapterId);
    const userCourse = await db.examRecord.findMany({
      where: { userId: params.userId, moduleId: params.chapterId },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(userCourse);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: { userId: string; chapterId: string } }
) {
  try {
    const { userId }: any = auth();
    const { examRecord, courseId, date } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userCourse = await db.examRecord.create({
      data: {
        examRecord,
        date,
        courseId,
        moduleId: params.chapterId,
        userId: params.userId,
      },
    });

    return NextResponse.json(userCourse);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
