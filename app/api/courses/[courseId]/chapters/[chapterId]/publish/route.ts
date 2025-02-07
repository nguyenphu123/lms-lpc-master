import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.moduleInCourse.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    let courseChapterBefore: any = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        ModuleInCourse: {
          where: {
            module: {
              isPublished: true,
            },
          },
        },
      },
    });

    await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        updateDate: new Date(),
        updatedBy: userId,
      },
    });
    const publishedChapter = await db.moduleInCourse.update({
      where: {
        courseId_moduleId: {
          moduleId: params.chapterId,
          courseId: params.courseId,
        },
      },
      data: {
        module: {
          update: {
            isPublished: true,
          },
        },
      },
    });
    let courseChapterAfter: any = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        ModuleInCourse: {
          include: {
            module: {
              select: {
                isPublished: true,
              },
            },
          },
        },
      },
    });
    const checkClassSessionRecord: any = await db.classSessionRecord.findMany({
      where: { courseId: params.courseId },
    });
    for (let i = 0; i < checkClassSessionRecord.length; i++) {
      await db.classSessionRecord.update({
        where: {
          id: checkClassSessionRecord[i].id,
        },
        data: {
          status: "studying",
          progress:
            (courseChapterBefore.Module.length /
              courseChapterAfter.Module.length) *
              100 +
            "%",
        },
      });
    }

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
