import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { clerkClient } from "@clerk/nextjs";

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();
    const { id, role } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.update({
      where: { id },
      data: {
        role,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const { createdUserId, department, emailAddress } = await req.json();

    let user = await clerkClient.users.updateUserMetadata(createdUserId, {
      publicMetadata: {
        role: "staff",
        department: department,
      },
    });
    let creatUser = await db.user.create({
      data: {
        id: createdUserId,
        role: "staff",
        email: emailAddress,
        status: "pending",
        username: emailAddress,
        star: 0,
      },
    });
    await db.department.upsert({
      where: {
        title: department,
      },
      create: {
        title: department,
        User: {
          connect: {
            id: createdUserId,
          },
        },
      },
      update: {
        User: {
          connect: {
            id: createdUserId,
          },
        },
      },
    });

    return NextResponse.json(creatUser);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
