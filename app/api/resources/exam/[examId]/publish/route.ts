import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const { userId }: any = auth();

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const publishedModule = await db.module.update({
      where: {
        id: params.examId,
      },
      data: {
        isPublished: true,
        // updateDate: new Date(),
        // updatedBy: userId,
      },
    });

    return NextResponse.json(publishedModule);
  } catch (error) {
    console.log("[EXAM_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
