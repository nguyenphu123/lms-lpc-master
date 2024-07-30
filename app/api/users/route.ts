import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

import { clerkClient } from "@clerk/nextjs";

export async function GET(req: Request) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const users = await db.user.findMany({
      where: {
        status: {
          not: "inActive",
        },
      },
      include: {
        ClassSessionRecord: {
          include: {
            course: {
              include: {
                Module: {
                  orderBy: { position: "asc" },
                  include: {
                    UserProgress: {
                      include: {
                        module: true,
                      },
                    },
                  },
                },
              },
            },
          },
          where: {
            course: {
              isPublished: true,
            },
          },
        },
        Department: true,
        UserProgress: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
