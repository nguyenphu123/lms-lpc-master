import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedProgram = await db.program.update({
      where: {
        id: params.programId,
        userId,
      },
      data: {
        isPublished: false,

        updatedBy: userId,
      },
    });

    return NextResponse.json(unpublishedProgram);
  } catch (error) {
    console.log("[PROGRAM_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
