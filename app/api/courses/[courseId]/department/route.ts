import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { departmentList }: any = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const deleteAllLink = await db.courseOnDepartment.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });
    for (let i = 0; i < departmentList.length; i++) {
      const updateCourse = await db.courseOnDepartment.create({
        data: {
          courseId: params.courseId,
          departmentId: departmentList[i].id,
        },
      });
      const findUsers = await db.user.findMany({
        where: {
          departmentId: departmentList[i].id,
        },
      });
      await db.classSessionRecord.createMany({
        data: findUsers.map((user) => ({
          userId: user.id,
          courseId: params.courseId,
        })),
      });
    }
    return NextResponse.json("");
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
