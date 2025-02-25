// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";

// import { db } from "@/lib/db";
// import { connect } from "http2";

// export async function POST(
//   req: Request,
//   { params }: { params: { courseId: string } }
// ) {
//   try {
//     const { userId } = auth();
//     const { exams }: any = await req.json();
//     let exam: any = [];
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//     for (let i = 0; i < exams.length; i++) {
//       exam = await db.examInCourse.create({
//         data: {
//           courseId: params.courseId,

//           examId: exams[i],
//         },
//       });
//     }

//     await db.course.update({
//       where: {
//         id: params.courseId,
//       },
//       data: {
//         updateDate: new Date(),
//         updatedBy: userId,
//       },
//     });
//     return NextResponse.json(exam);
//   } catch (error) {
//     console.log("[CHAPTERS]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { exams }: any = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all exams currently associated with the course
    const existingExams = await db.examInCourse.findMany({
      where: {
        courseId: params.courseId,
      },
    });

    // Remove exams that are no longer selected
    const examsToRemove = existingExams.filter(
      (exam: any) => !exams.includes(exam.examId)
    );
    await db.examInCourse.deleteMany({
      where: {
        id: {
          in: examsToRemove.map((exam: any) => exam.id),
        },
      },
    });

    // Add new exams that are not already in the course
    const newExams = exams.filter(
      (exam: string) => !existingExams.some((e: any) => e.examId === exam)
    );

    let createdExams: any = [];
    for (let i = 0; i < newExams.length; i++) {
      createdExams = await db.examInCourse.create({
        data: {
          courseId: params.courseId,
          examId: newExams[i],
        },
      });
    }

    // Optionally, update the course update date and user who updated it
    await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        updateDate: new Date(),
        updatedBy: userId,
      },
    });

    return NextResponse.json(createdExams);
  } catch (error) {
    console.log("[EXAM API ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const exams = await db.examInCourse.findMany({
      where: {
        courseId: params.courseId,
      },
      select: {
        examId: true,
      },
    });
    return NextResponse.json(exams);
  } catch (error) {
    console.log("[GET EXAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
