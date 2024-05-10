import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { permissionId: string } }
) {
  try {
    const { userId }: any = auth();
    const { title } = await req.json();
    const permission = await db.permission.update({
      where: {
        id: params.permissionId,
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
  { params }: { params: { permissionId: string } }
) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const permission = await db.permission.findMany({
      where: {
        id: params.permissionId,
      },
    });
    return NextResponse.json(permission);
  } catch (error) {
    console.log("[PERMISSIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
