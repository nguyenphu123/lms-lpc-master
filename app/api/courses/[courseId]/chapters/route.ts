import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { connect } from "http2";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { modules }: any = await req.json();
    let chapter: any = [];
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    for (let i = 0; i < modules.length; i++) {
      const getModuleCount = await db.moduleInCourse.count({
        where: {
          courseId: params.courseId,
        },
      });
      const getModuleCountAll = await db.moduleInCourse.count({
        where: {
          courseId: params.courseId,
        },
      });
      const updateCourse = await db.classSessionRecord.updateMany({
        where: {
          courseId: params.courseId,
          status: "finished",
          progress: "100%",
        },
        data: {
          status: "studying",
          progress: (getModuleCount / getModuleCountAll + 1) * 100 + "%",
        },
      });
      const lastChapter = await db.moduleInCourse.findFirst({
        where: {
          courseId: params.courseId,
        },
        orderBy: {
          position: "desc",
        },
      });

      const newPosition = lastChapter ? lastChapter.position + 1 : 1;
      chapter = await db.moduleInCourse.create({
        data: {
          courseId: params.courseId,
          position: newPosition,
          moduleId: modules[i],
        },
      });
    }

    await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        updateDate: new Date(),
        updatedBy: userId,
      },
    });
    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
