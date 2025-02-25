import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const { userId }: any = auth();
    const { contents } = await req.json(); // expects the exam details to be sent in the "contents"
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update exam details in the database
    const updateModule = await db.exam.update({
      where: { id: params.examId },
      data: { ...contents },
    });

    return NextResponse.json(updateModule);
  } catch (error) {
    console.log("[EXAM_PUBLISH]", error);
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

    // Fetch exam data based on the examId
    const exam = await db.exam.findUnique({
      where: { id: params.examId },
      include: {
        category: {
          include: {
            question: {},
          },
        },
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.log("[EXAM_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
