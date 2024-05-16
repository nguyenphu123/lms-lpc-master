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
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.delete({
      where: { id: params.userId },
    });
    await db.bookMark.deleteMany({
      where: { userId: params.userId },
    });
    await db.classSessionRecord.deleteMany({
      where: { userId: params.userId },
    });
    await db.userProgress.deleteMany({
      where: { userId: params.userId },
    });
    const deleteUser = await clerkClient.users.deleteUser(params.userId);
    return NextResponse.json("success");
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
