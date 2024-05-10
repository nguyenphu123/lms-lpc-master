import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const { userId }: any = auth();
    const { title } = await req.json();
    const role = await db.role.update({
      where: {
        id: params.roleId,
      },
      data: {
        title,
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    console.log("[ROLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const role = await db.role.findMany({
      where: {
        id: params.roleId,
      },
    });
    return NextResponse.json(role);
  } catch (error) {
    console.log("[ROLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
