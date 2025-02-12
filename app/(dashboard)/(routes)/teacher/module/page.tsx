import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const ModulePage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const checkUser = await db.userPermission.findMany({
    where: {
      userId: userId,
    },
    include: {
      permission: true,
    },
  });
  const userDepartment: any = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Department: true,
    },
  });
  if (
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Edit program permission") == -1 &&
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Create program permission") == -1
  ) {
    return redirect("/");
  }
  let module: any = [];
  if (
    userDepartment.title != "BOD" &&
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Manage all course permission") == -1 &&
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Manage all program permission") == -1
  ) {
    module = await db.module.findMany({
      // where: {
      //   userId,
      // },
      include: {
        ModuleInCourse: {
          include: {
            course: true,
          },
        },
      },
    });
  } 
  console.log(module)
  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={module}
        canCreate={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("Create program permission") != -1
        }
        canEdit={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("Edit program permission") != -1
        }
      />
    </div>
  );
};

export default ModulePage;
