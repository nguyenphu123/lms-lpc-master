import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; examId: string } }
) {
  try {
    const { userId }: any = auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Giá trị mặc định cho exam
    const defaultTimeLimit = 60; // Giới hạn thời gian mặc định
    const defaultPassPercentage = 80; // % để đỗ mặc định

    // Tạo mới exam với các giá trị mặc định
    const newExam = await db.exam.create({
      data: {
        title: title,
        timeLimit: defaultTimeLimit, // Giới hạn thời gian mặc định
        scoreLimit: defaultPassPercentage, // % để đỗ mặc định
      },
    });

    return NextResponse.json(newExam);
  } catch (error) {
    console.log("[EXAM_PUBLISH]", error);
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
    console.log("[EXAM_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
