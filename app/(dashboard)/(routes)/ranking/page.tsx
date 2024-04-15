import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getUser } from "@/actions/get-user";

const UserRank = async () => {
  const { sessionClaims }: any = auth();

  if (!sessionClaims.userId) {
    return redirect("/");
  }

  // await db.user.upsert({
  //   where: { id: sessionClaims.userId },
  //   update: {
  //     role: sessionClaims.userInfo.role || "staff",

  //     imageUrl: sessionClaims.userImage || "",
  //   },
  //   create: {
  //     id: sessionClaims.userId,
  //     email: sessionClaims.email,
  //     username: sessionClaims.username,
  //     star: 0,
  //     role: sessionClaims.userInfo.role || "staff",

  //     imageUrl: sessionClaims.userImage || "",
  //   },
  // });
  // await db.department.upsert({
  //   where: { title: sessionClaims.userInfo.department },
  //   create: {
  //     title: sessionClaims.userInfo.department,
  //     User: {
  //       connect: {
  //         id: sessionClaims.userId,
  //       },
  //     },
  //   },
  //   update: {
  //     title: sessionClaims.userInfo.department,
  //     User: {
  //       connect: {
  //         id: sessionClaims.userId,
  //       },
  //     },
  //   },
  // });

  const users: any = await getUser();
  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UserRank;
