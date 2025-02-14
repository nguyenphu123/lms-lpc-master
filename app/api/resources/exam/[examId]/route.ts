import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const { userId }: any = auth();
    const { contents } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const updateModule = await db.exam.update({
      where: {
        id: params.examId,
      },
      data: {
        ...contents,
      },
    });

    return NextResponse.json(updateModule);
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
    const exam: any = await db.exam.findUnique({
      where: {
        id: params.examId,
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
