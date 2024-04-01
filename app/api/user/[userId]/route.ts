import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId }: any = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await db.department.upsert({
      where: {
        title: values.department,
      },
      create: {
        title: values.department,
        User: {
          connect: {
            id: params.userId,
          },
        },
      },
      update: {
        User: {
          connect: {
            id: params.userId,
          },
        },
      },
    });
    const user = await db.user.update({
      where: { id: params.userId },
      data: {
        role: values.role,
        status: values.status,
        username: values.username,
      },
    });

    delete values.status;
    delete values.username;
    const updatedUser = await clerkClient.users.updateUser(params.userId, {
      publicMetadata: values,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
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
    const deleteUser = await clerkClient.users.deleteUser(params.userId);
    return NextResponse.json("success");
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
