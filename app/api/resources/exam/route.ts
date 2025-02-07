import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; examId: string } }
) {
  try {
    const { userId, value }: any = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const newExam = await db.question.create({
      data: {
        ...value,
      },
    });

    return NextResponse.json(newExam);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
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
    const questionsList: any = await db.exam.findMany({});
    return NextResponse.json(questionsList);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
