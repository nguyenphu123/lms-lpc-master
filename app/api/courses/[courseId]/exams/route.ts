import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { connect } from "http2";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { exams }: any = await req.json();
    let exam: any = [];
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    for (let i = 0; i < exams.length; i++) {
      exam = await db.examInCourse.create({
        data: {
          courseId: params.courseId,

          examId: exams[i],
        },
      });
    }

    await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        updateDate: new Date(),
        updatedBy: userId,
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
