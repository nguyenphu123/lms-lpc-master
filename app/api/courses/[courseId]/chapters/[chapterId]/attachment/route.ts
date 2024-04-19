import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; slideId: string } }
) {
  try {
    const { userId } = auth();
    const contents = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const createAttachment = await db.resource.createMany({
      data: contents,
      skipDuplicates: true,
    });

    return NextResponse.json(createAttachment);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; slideId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const createAttachment = await db.resource.findMany({
      where: {
        moduleId: params.chapterId,
      },
    });

    return NextResponse.json(createAttachment);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
