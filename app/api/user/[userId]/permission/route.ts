import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId }: any = auth();
    const { permissionList } = await req.json();
    const currentPermissionList = await db.userPermission.findMany({
      where: {
        userId: params.userId,
      },
    });
    for (const permission of currentPermissionList) {
      if (
        permissionList
          .map((item: { permissionId: any }) => item.permissionId)
          .indexOf(permission.permissionId) == -1
      ) {
        await db.userPermission.delete({
          where: {
            id: permission.id,
            permissionId: permission.permissionId,
            userId: params.userId,
          },
        });
      }
    }
    for (const permission of permissionList) {
      const checkPermission = await db.userPermission.findFirst({
        where: {
          permissionId: permission.permissionId,
          userId: params.userId,
        },
      });
      if (checkPermission) {
      } else {
        await db.userPermission.create({
          data: {
            permissionId: permission.permissionId,
            userId: params.userId,
          },
        });
      }
    }

    return NextResponse.json("success");
  } catch (error) {
    console.log("[ROLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
