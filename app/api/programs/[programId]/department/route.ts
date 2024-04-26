import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const date = new Date().toISOString();
    const { userId } = auth();
    const { departmentList }: any = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const getAllCourseInProgram = await db.courseWithProgram.findMany({
      where: {
        programId: params.programId,
      },
    });
    for (let i = 0; i < getAllCourseInProgram.length; i++) {
      const deleteAllLink = await db.courseOnDepartment.deleteMany({
        where: {
          courseId: getAllCourseInProgram[i].courseId,
        },
      });
      for (let j = 0; j < departmentList.length; j++) {
        const updateCourse = await db.courseOnDepartment.create({
          data: {
            courseId: getAllCourseInProgram[i].courseId,
            departmentId: departmentList[j].id,
          },
        });
        const getUserFromDepartment = await db.user.findMany({
          where: {
            departmentId: departmentList[j].id,
          },
        });
        await db.classSessionRecord.createMany({
          data: getUserFromDepartment.map((user) => ({
            userId: user.id,
            courseId: getAllCourseInProgram[i].courseId,
            progress: "0%",
            status: "studying",
            startDate: date,
          })),
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
