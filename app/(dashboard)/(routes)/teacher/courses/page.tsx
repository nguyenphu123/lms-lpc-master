import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CoursesPage = async () => {
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
  let courses;
  if (
    userDepartment.title != "BOD" &&
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Manage all course permission") == -1
  ) {
    courses = await db.course.findMany({
      where: {
        OR: [
          {
            userId: userId,
            courseInstructedBy: userId,
            updatedBy: userId,
          },
        ],
      },
      orderBy: {
        startDate: "desc",
      },
      include: {
        user: true,
        updatedUser: true,
        courseInstructor: true,
      },
    });
  } else {
    courses = await db.course.findMany({
      // where: {
      //   userId,
      // },
      orderBy: {
        startDate: "desc",
      },
      include: {
        user: true,
        updatedUser: true,
        courseInstructor: true,
      },
    });
  }

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={courses}
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
