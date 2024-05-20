import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CoursesPage = async ({ params }: { params: { courseId: string } }) => {
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
      .indexOf("Edit course permission") == -1 &&
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Create course permission") == -1
  ) {
    return redirect("/");
  }
  let course: any = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });
  let exams: any = await db.module.findMany({
    where: {
      courseId: params.courseId,
      type: "Exam",
    },
    include: {
      UserProgress: {
        include: {
          user: true,
        },
      },
    },
  });

  return (
    <div className="p-6">
      <div className="flex flex-col gap-y-2">
        <Link
          href={`/teacher/courses`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to course
        </Link>
      </div>
      {course.title}
      <DataTable
        columns={columns}
        data={exams}
        canCreate={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("Create course permission") != -1
        }
        canEdit={
          checkUser
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("Edit course permission") != -1
        }
      />
    </div>
  );
};

export default CoursesPage;
