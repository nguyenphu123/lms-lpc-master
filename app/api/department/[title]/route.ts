import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

export async function GET(
  req: Request,
  { params }: { params: { title: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const department: any = await db.department.findUnique({
      where: { title: params.title },
      include: {
        CourseOnDepartment: {
          include: {
            course: {
              include: {
                Module: true,
              },
            },
          },
        },
      },
    });
    const coursesWithProgress: any = await Promise.all(
      department.CourseOnDepartment.map(async (course: any) => {
        const progressPercentage = await getProgress(userId, course.course.id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );
    // console.log(coursesWithProgress);
    let newList = [];
    for (let i = 0; i < coursesWithProgress.length; i++) {
      coursesWithProgress[i].course["progress"] =
        coursesWithProgress[i].progress;
      newList.push(coursesWithProgress[i].course);
    }
    return NextResponse.json(newList);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
