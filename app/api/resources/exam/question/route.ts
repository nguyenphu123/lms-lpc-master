import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const { userId, questionsList }: any = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    for (let i = 0; i < questionsList.length; i++) {
      const newQuestion = await db.question.create({
        data: {
          ...questionsList[i],
        },
      });
    }

    return NextResponse.json("success");
  } catch (error) {
    console.log("[EXAM_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const questionsList: any = await db.question.findMany({});
    return NextResponse.json(questionsList);
  } catch (error) {
    console.log("[EXAM_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
