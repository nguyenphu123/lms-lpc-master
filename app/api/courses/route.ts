import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims }: any = auth();
    const { title } = await req.json();
    let userInfo: any = await db.user.findUnique({
      where: { id: userId, status: "approved" },
    });

    const date = new Date();
    const course = await db.course.create({
      data: {
        userId,
        title,
        createdDate: date,
        isPublished: false,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const { userId, sessionClaims }: any = auth();

    const course = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        courseInstructor: true,
        courseWithProgram: {
          include: {
            program: true,
          },
        },
        ModuleInCourse: {
          orderBy: {
            position: "asc",
          },

          include: {
            module: {},
          },
        },
        ExamInCourse: {
          include: {
            exam: {},
          },
        },
        ClassSessionRecord: {
          include: {
            user: true,
          },
        },
        CourseOnDepartment: {
          include: {
            Department: true,
          },
        },
        user: true,
        updatedUser: true,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
