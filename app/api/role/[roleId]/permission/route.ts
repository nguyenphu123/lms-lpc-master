import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const { userId }: any = auth();
    const { permissionList } = await req.json();
    const currentPermissionList = await db.rolePermission.findMany({
      where: {
        roleId: params.roleId,
      },
    });
    for (const permission of currentPermissionList) {
      if (
        permissionList
          .map((item: { permissionId: any }) => item.permissionId)
          .indexOf(permission.permissionId) == -1
      ) {
        await db.rolePermission.delete({
          where: {
            id: permission.id,
            permissionId: permission.permissionId,
            roleId: params.roleId,
          },
        });
      }
    }
    for (const permission of permissionList) {
      const checkPermission = await db.rolePermission.findFirst({
        where: {
          permissionId: permission.permissionId,
          roleId: params.roleId,
        },
      });
      if (checkPermission) {
      } else {
        await db.rolePermission.create({
          data: {
            permissionId: permission.permissionId,
            roleId: params.roleId,
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
