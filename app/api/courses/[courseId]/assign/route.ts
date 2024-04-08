import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { studentList } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (const student of studentList) {
      await db.classSessionRecord.upsert({
        where: {
          courseId_userId: {
            courseId: courseId.toString(),
            userId: student.id,
          },
        },
        create: {
          courseId,
          userId: student.id,
          progress: "0%",
          status: "studying",
        },
        update: {},
      });
    }
    return NextResponse.json("");
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}