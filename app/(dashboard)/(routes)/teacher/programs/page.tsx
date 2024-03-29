import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const ProgramsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const programs: any = await db.program.findMany({
    // where: {
    //   userId,
    // },
    orderBy: {
      startDate: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={programs} />
    </div>
  );
};

export default ProgramsPage;
