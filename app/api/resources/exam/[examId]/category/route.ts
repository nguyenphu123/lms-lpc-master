import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { link } from "fs";
import Exam from "@/app/(dashboard)/(routes)/teacher/exam/[examId]/page";
import { connect } from "http2";
import { title } from "process";

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId }: any = auth();
    const { contents } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const updateCategory = await db.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        ...contents,
      },
    });

    return NextResponse.json(updateCategory);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const category: any = await db.exam.findUnique({
      where: {
        id: params.examId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const { userId }: any = auth();
    const contents = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const createCategory = await db.category.upsert({
      where: {
        id: contents.id.toString(),
      },
      update: {
        title: contents.title,
        numOfAppearance: contents.numOfAppearance,
      },
      create: {
        title: contents.title,
        numOfAppearance: contents.numOfAppearance,
        Exam: {
          connect: {
            id: params.examId,
          },
        },
      },
    });

    for (let i = 0; i < contents.question.length; i++) {
      const newQuestion = await db.question.upsert({
        where: { id: contents.question[i].id.toString() },
        update: {
          question: contents.question[i].question,
          type: contents.question[i].type,
          compulsory: contents.question[i].compulsory == true ? true : false,
          score: contents.question[i].score,
        },
        create: {
          question: contents.question[i].question,
          type: contents.question[i].type,
          compulsory: contents.question[i].compulsory == true ? true : false,
          score: contents.question[i].score,

          category: {
            connect: {
              id: createCategory.id,
            },
          },
        },
      });
      for (let k = 0; k < contents.question[i].answer.length; k++) {
        const newAnwser = await db.answer.upsert({
          where: { id: contents.question[i].answer[k].id.toString() },
          update: {
            text: contents.question[i].answer[k].text,
            isCorrect:
              contents.question[i].answer[k].isCorrect == true ? true : false,
          },
          create: {
            text: contents.question[i].answer[k].text,
            isCorrect:
              contents.question[i].answer[k].isCorrect == true ? true : false,
            question: {
              connect: {
                id: newQuestion.id,
              },
            },
          },
        });
      }
    }

    return NextResponse.json(createCategory);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
