import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: params.userId },
      include: {
        ClassSessionRecord: {
          where: {
            userId: params.userId,
          },
          include: {
            course: {
              include: {
                Module: {
                  where: {
                    type: "Exam",
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId }: any = auth();
    const { exam, note } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const noted = await db.userExamReport.create({
      data: {
        userId: params.userId,
        moduleId: exam,
        note,
      },
    });

    return NextResponse.json(noted);
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
