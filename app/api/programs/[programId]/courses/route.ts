import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const { userId } = auth();
    const { programId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const programOwnCourses = await db.course.findMany({
      where: {
        courseWithProgram: {
          some: {
            programId: params.programId,
          },
        },
      },
      include: {
        courseWithProgram: true,
      },
    });
    await db.program.update({
      where: {
        id: programId,
      },
      data: {
        updatedBy: userId,
      },
    });
    return NextResponse.json(programOwnCourses);
  } catch (error) {
    console.log("[PROGRAM_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const { userId } = auth();

    const { id } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updateProgram = await db.courseWithProgram.upsert({
      where: {
        programId_courseId: {
          programId: params.programId,
          courseId: id,
        },
      },
      create: {
        programId: params.programId,
        courseId: id,
      },
      update: { programId: "", courseId: "" },
    });
    const getCourseCount = await db.courseWithProgram.count({
      where: {
        courseId: id,
        programId: params.programId,
        course: {
          ClassSessionRecord: {
            every: { status: "finished", progress: "100%" },
          },
        },
      },
    });
    const getCourseCountAll = await db.courseWithProgram.count({
      where: {
        courseId: id,
        programId: params.programId,
      },
    });
    const updateCourse = await db.programParticipantRecord.updateMany({
      where: {
        programId: params.programId,
        status: "finished",
        progress: "100%",
      },
      data: {
        status: "studying",
        progress: (getCourseCount / getCourseCountAll) * 100 + "%",
      },
    });
    const deleteLink = await db.courseWithProgram.deleteMany({
      where: {
        courseId: "",
        programId: "",
      },
    });
    return NextResponse.json(deleteLink);
  } catch (error) {
    console.log("[PROGRAM_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
