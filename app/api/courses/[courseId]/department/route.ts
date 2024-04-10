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
    const date = new Date().toISOString();
    for (let i = 0; i < departmentList.length; i++) {
      if (departmentList[i].isEnrolled) {
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
            progress: "0%",
            status: "studying",
            startDate: date,
          })),
          skipDuplicates: true,
        });
      } else {
      }
    }
    return NextResponse.json("");
  } catch (error) {
    console.log("DEPARTMENT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
