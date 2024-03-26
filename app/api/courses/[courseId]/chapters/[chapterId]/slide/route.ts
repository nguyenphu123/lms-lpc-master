import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { contents } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.module.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter || !chapter.title) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    for (let i = 0; i < contents.length; i++) {
      const createSlide = await db.slide.upsert({
        where: { id: contents[i].id || "" },
        update: {
          title: contents[i].title,
          content: contents[i].content,
          contentType: contents[i].contentType,
          videoUrl: contents[i].videoUrl,
          fileUrl: contents[i].fileUrl,
          description: contents[i].description,
        },
        create: {
          moduleId: chapter.id,
          title: contents[i].title,
          position: i,
          content: contents[i].content,
          contentType: contents[i].contentType,
          videoUrl: contents[i].videoUrl,
          fileUrl: contents[i].fileUrl,
          description: contents[i].description,
        },
      });
    }

    return NextResponse.json("success");
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.module.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter || !chapter.title) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const slide = await db.slide.findMany({
      where: { moduleId: chapter.id },
      include: {
        Resource: true,
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
