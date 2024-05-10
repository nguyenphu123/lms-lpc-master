import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getUser } from "@/actions/get-user";

const UsersPage = async () => {
  const { userId, sessionClaims }: any = auth();

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
  if (
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("User approval permission") == -1 &&
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("User management permission") == -1
  ) {
    return redirect("/");
  }

  const users: any = await getUser();

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={users}
        canCreate={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("User approval permission") != -1
        }
        canEdit={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("User management permission") != -1
        }
      />
    </div>
  );
};

export default UsersPage;
