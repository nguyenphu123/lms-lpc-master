import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs";

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
