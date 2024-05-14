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

    const userCourse = await db.examRecord.findFirst({
      where: { userId: params.userId, moduleId: params.chapterId },
    });

    return NextResponse.json(userCourse);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string; chapterId: string } }
) {
  try {
    const { userId }: any = auth();
    const { examRecord } = await req.json();
    console.log(examRecord);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    for (let i = 0; i < examRecord.length; i++) {
      const userCourse = await db.examRecord.upsert({
        where: { id: examRecord[i].id },
        update: { isRight: examRecord[i].isRight },
        create: {
          userId: params.userId,
          moduleId: params.chapterId,
          question: examRecord[i].question,
          isRight: examRecord[i].isRight,
        },
      });
    }

    return NextResponse.json("");
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
