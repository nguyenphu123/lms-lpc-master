import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getUser } from "@/actions/get-user";

const UsersPage = async () => {
  const { userId, sessionClaims }: any = auth();
  let userInfo: any = await db.user.findUnique({
    where: { id: userId },
  });
  if (!userId) {
    return redirect("/");
  }
  if (sessionClaims.userInfo.staff) {
    return redirect("/");
  }
  if (userInfo.status == "pending") {
    return redirect("/pending");
  }
  const users: any = await getUser();
  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UsersPage;
