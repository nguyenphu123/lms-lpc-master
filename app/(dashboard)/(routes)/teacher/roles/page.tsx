import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const RolesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const roles = await db.role.findMany({
   
    
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={roles} />
    </div>
  );
};

export default RolesPage;
