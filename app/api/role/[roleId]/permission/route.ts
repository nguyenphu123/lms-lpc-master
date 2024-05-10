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
    if (currentPermissionList.length == 0) {
      for (const permission of permissionList) {
        await db.rolePermission.create({
          data: {
            permissionId: permission.permissionId,
            roleId: params.roleId,
          },
        });
      }
    }
    for (const currentPermission of currentPermissionList) {
      if (
        permissionList
          .map((item: { permissionId: any }) => item.permissionId)
          .indexOf(currentPermission.permissionId) == -1
      ) {
        await db.rolePermission.delete({
          where: {
            id: currentPermission.id,
            permissionId: currentPermission.permissionId,
            roleId: params.roleId,
          },
        });
      }

      for (const permission of permissionList) {
        if (currentPermissionList.length > 0) {
          if (
            currentPermissionList
              .map((item: { permissionId: any }) => item.permissionId)
              .indexOf(permission.permissionId) == -1
          ) {
            await db.rolePermission.create({
              data: {
                permissionId: permission.permissionId,
                roleId: params.roleId,
              },
            });
          }
        } else {
          await db.rolePermission.create({
            data: {
              permissionId: permission.permissionId,
              roleId: params.roleId,
            },
          });
        }
      }
    }

    return NextResponse.json("success");
  } catch (error) {
    console.log("[ROLES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
