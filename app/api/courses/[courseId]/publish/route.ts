import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId }: any = auth();

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: true,
        updateDate: new Date(),
        updatedBy: userId,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
