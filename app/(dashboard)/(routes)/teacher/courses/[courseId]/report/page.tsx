import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import axios from "axios";

const ReportPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const userProgress: any = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      ClassSessionRecord: { include: { user: true } },
    },
  });
  let data: any = [];
  for (let i = 0; i < userProgress.ClassSessionRecord.length; i++) {
    let item = {
      imageUrl: userProgress.ClassSessionRecord[i].user.imageUrl,
      username: userProgress.ClassSessionRecord[i].user.username,
      email: userProgress.ClassSessionRecord[i].user.email,
      department: userProgress.ClassSessionRecord[i].user.department,
      status: userProgress.ClassSessionRecord[i].status,
      progress: userProgress.ClassSessionRecord[i].progress,
      endDate: userProgress.ClassSessionRecord[i].endDate,
    };
    data.push(item);
  }
  return (
    <div className="p-6">
      <Link
        href="javascript:history.back()"
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to course setup
      </Link>
      <DataTable columns={columns} data={data} title={userProgress.title} />
    </div>
  );
};

export default ReportPage;
