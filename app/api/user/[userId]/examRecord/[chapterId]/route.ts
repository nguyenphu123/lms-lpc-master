import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { userId: string; courseId: string; examId: string } }
) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userCoursesExamsRecord: any = await db.examInCourse.findUnique({
      where: {
        courseId_examId: {
          courseId: params.courseId,
          examId: params.examId,
        },
      },
    });
    const userExamRecords = await db.examRecord.findMany({
      where: {
        userId: params.userId,
        examInCourseId: userCoursesExamsRecord.id,
      },
      orderBy: {
        endDate: "desc",
      },
    });

    return NextResponse.json(userExamRecords);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: { userId: string; courseId: string; examId: string } }
) {
  try {
    const { userId }: any = auth();
    const { examRecord, courseId, date } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userCoursesExamsRecord: any = await db.examInCourse.findUnique({
      where: {
        courseId_examId: {
          courseId: params.courseId,
          examId: params.examId,
        },
      },
    });
    const userCourse = await db.examRecord.create({
      data: {
        progress: "0%",
        startDate: date,
        status: "unattempted",
        examRecord,
        date,
        examInCourseId: userCoursesExamsRecord.id,
        userId: params.userId,
      },
    });

    return NextResponse.json(userCourse);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
