import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const bookmark = await db.bookMark.create({
      data: {
        courseId: params.courseId,
        userId,
      },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.log("BOOKMARK_COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const bookmark = await db.bookMark.delete({
      where: {
        courseId_userId: {
          courseId: params.courseId,
          userId,
        },
      },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.log("BOOKMARK_COURSE_ID_DETACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
