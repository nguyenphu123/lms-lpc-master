import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { categoryId: string; questionId: string } }
) {
  try {
    const { userId, question }: any = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const newQuestion = await db.question.create({
      data: {
        ...question,
      },
    });

    return NextResponse.json(newQuestion);
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
    const questionsList: any = await db.question.findMany({});
    return NextResponse.json(questionsList);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string; questionId: string } }
) {
  try {
    const { userId, questions }: any = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const newQuestion = await db.question.update({
      where:{
        id: params.questionId,
      },
      data: {
        ...questions,
      },
    });

    return NextResponse.json(newQuestion);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}