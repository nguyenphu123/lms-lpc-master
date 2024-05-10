import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const PermissionsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const permissions = await db.permission.findMany({});

  return (
    <div className="p-6">
      <DataTable columns={columns} data={permissions} />
    </div>
  );
};

export default PermissionsPage;