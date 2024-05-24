import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { departmentId: string } }
) {
  try {
    const { userId }: any = auth();
    const { title } = await req.json();
    const permission = await db.department.update({
      where: {
        id: params.departmentId,
      },
      data: {
        title,
      },
    });

    return NextResponse.json(permission);
  } catch (error) {
    console.log("[PERMISSIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { departmentId: string } }
) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const permission = await db.department.findUnique({
      where: {
        id: params.departmentId,
      },
    });
    return NextResponse.json(permission);
  } catch (error) {
    console.log("[PERMISSIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
