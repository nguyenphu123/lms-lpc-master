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
      include: {
        courseWithProgram: {},
      },
    });

    if (!program) {
      return new NextResponse("Not found", { status: 404 });
    }

    // const hasPublishedChapter = program.Course.some(
    //   (module: { isPublished: any }) => module.isPublished
    // );

    if (
      !program.title ||
      !program.description ||
      !program.imageUrl
      // !program.programId ||
      // !hasPublishedChapter
    ) {
      return new NextResponse("Missing required fields", { status: 401 });
    }

    const publishedProgram = await db.program.update({
      where: {
        id: params.programId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedProgram);
  } catch (error) {
    console.log("[PROGRAM_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
