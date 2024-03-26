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

    const program = await db.program.findUnique({
      where: {
        id: params.programId,
        userId,
      },
    });

    if (!program) {
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedProgram = await db.program.update({
      where: {
        id: params.programId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedProgram);
  } catch (error) {
    console.log("[PROGRAM_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
