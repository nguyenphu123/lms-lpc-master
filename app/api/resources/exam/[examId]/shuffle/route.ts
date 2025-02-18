import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; examId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const examInCourse = await db.examInCourse.findUnique({
      where: {
        courseId_examId: {
          examId: params.examId,
          courseId: params.courseId,
        },
      },
    });
    const data = await Promise.all(await req.json()).then(async function (
      values: any
    ) {
      for (let k = 0; k < values.length; k++) {
        const { maxAttempt }: any = values[k];
        const category = await db.examInCourse.upsert({
          where: {
            courseId_examId: {
              examId: params.examId,
              courseId: params.courseId,
            },
          },
          update: {
            maxAttempt: parseInt(maxAttempt),
          },
          create: {
            examId: params.examId,
            courseId: params.courseId,
            maxAttempt: parseInt(maxAttempt),
          },
        });
      }
    });
    return NextResponse.json("success");
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
    const questionsList: any = await db.examInCourse.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        exam: {
          include: {
            category: {
              include: {
                question: {
                  include: {
                    answer: {},
                  },
                },
              },
            },
          },
        },
      },
    });
    for (let i = 0; i < questionsList.Category.length; i++) {
      questionsList.exam.category[i]["question"] =
        questionsList.Category[i].exam;
    }

    return NextResponse.json(questionsList);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
