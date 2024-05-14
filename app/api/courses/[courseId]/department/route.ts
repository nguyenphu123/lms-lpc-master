import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { departmentList, assignList }: any = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const deleteAllLink = await db.courseOnDepartment.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });
    const date = new Date();
    for (let i = 0; i < departmentList.length; i++) {
      if (departmentList[i].isEnrolled) {
        const updateCourse = await db.courseOnDepartment.create({
          data: {
            courseId: params.courseId,
            departmentId: departmentList[i].id,
          },
        });
      } else {
      }
    }
    for (let i = 0; i < assignList.length; i++) {
      if (assignList[i].isEnrolled) {
        await db.classSessionRecord.createMany({
          data: {
            userId: assignList[i].id,
            courseId: params.courseId,
            progress: "0%",
            status: "studying",
            startDate: date,
          },
          skipDuplicates: true,
        });
      }
    }
    return NextResponse.json("");
  } catch (error) {
    console.log("DEPARTMENT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
