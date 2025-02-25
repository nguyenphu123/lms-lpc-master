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
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Lấy tất cả các module hiện có trong khóa học
    const existingModules = await db.moduleInCourse.findMany({
      where: {
        courseId: params.courseId,
      },
    });

    // Xóa các module không còn được chọn
    const modulesToRemove = existingModules.filter(
      (module: any) => !modules.includes(module.moduleId)
    );
    await db.moduleInCourse.deleteMany({
      where: {
        id: {
          in: modulesToRemove.map((module: any) => module.id),
        },
      },
    });

    // Thêm các module mới nếu chưa có trong database
    const newModules = modules.filter(
      (module: string) => !existingModules.some((m: any) => m.moduleId === module)
    );

    let chapter: any = [];
    for (let i = 0; i < newModules.length; i++) {
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
          moduleId: newModules[i],
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const modules = await db.moduleInCourse.findMany({
      where: {
        courseId: params.courseId,
      },
      select: {
        moduleId: true,
      },
    });
    return NextResponse.json(modules);
  } catch (error) {
    console.log("[GET MODULES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

