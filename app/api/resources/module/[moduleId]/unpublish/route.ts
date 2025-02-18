import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedModule = await db.module.update({
      where: {
        id: params.moduleId,
      },
      data: {
        isPublished: false,
        // updateDate: new Date(),
        // updatedBy: userId,
      },
    });

    return NextResponse.json(unpublishedModule);
  } catch (error) {
    console.log("[MODULE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
