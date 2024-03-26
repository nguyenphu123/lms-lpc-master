import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getUser } from "@/actions/get-user";

const UsersPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const users: any = await getUser();
  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UsersPage;
