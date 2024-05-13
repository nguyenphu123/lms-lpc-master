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
    const { instructorList } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (const instructor of instructorList) {
      if (instructor.isAssign) {
        await db.course.update({
          where: {
            id: courseId,
          },
          data: {
            courseInstructedBy: instructor.id,
          },
        });
      } else {
      }
    }
    return NextResponse.json("");
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
