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

    const unpublishedChapter = await db.moduleInCourse.update({
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

    const publishedChaptersInCourse = await db.moduleInCourse.findMany({
      where: {
        courseId: params.courseId,
        module: {
          isPublished: true,
        },
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
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
    let courseChapterAfter: any = await db.course.findUnique({
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
    const checkClassSessionRecord: any = await db.classSessionRecord.findMany({
      where: { courseId: params.courseId },
    });
    for (let i = 0; i < checkClassSessionRecord.length; i++) {
      await db.classSessionRecord.update({
        where: {
          id: checkClassSessionRecord[i].id,
        },
        data: {
          status:
            courseChapterBefore.Module.length ==
            courseChapterAfter.Module.length
              ? "finished"
              : "studying",
          progress:
            (courseChapterBefore.Module.length /
              courseChapterAfter.Module.length) *
              100 +
            "%",
        },
      });
    }
    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
