import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = auth();
  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const availableCourses = await db.course.findMany({
      where: {
        isPublished: true,
        courseWithProgram: {
          none: {},
        },
      },
    });

    return NextResponse.json(availableCourses);
  } catch (error) {
    console.log("COURSES_ROUTE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
