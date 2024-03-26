import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { title, type } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const getModuleCount = await db.module.count({
      where: {
        courseId: params.courseId,
        UserProgress: {
          every: {
            status: "finished",
            progress: "100%",
          },
        },
      },
    });
    const getModuleCountAll = await db.module.count({
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
    const lastChapter = await db.module.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    const chapter = await db.module.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,

        type,

        userId,

        isPublished: false,
      },
    });
    // if (chapter.type.toLowerCase() == "slide") {
    // } else {
    //   const exam = await db.exam.create({
    //     data: {
    //       moduleId: chapter.id,
    //     },
    //   });
    // }
    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
