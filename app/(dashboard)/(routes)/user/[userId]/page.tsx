import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import Avatar from "./_components/avatar";
import Star from "./_components/star";
import UserInformation from "./_components/infomation-form";
import CourseHistory from "./_components/courses-history";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

interface userValue {
  userId: string;
  star: number;
  imageUrl: string;
  role: string;
  permissionRole: string;
}
const UserPage = async ({ params }: { params: { userId: string } }) => {
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
  if (
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("User personal management permission") == -1
  ) {
    return redirect("/");
  }
  const user: userValue | any = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Department: true,
    },
  });

  const courses = await db.course.findMany({
    where: {
      ClassSessionRecord: {
        every: {
          userId,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
    include: {
      Module: {
        include: {
          UserProgress: true,
        },
      },
    },
  });

  return (
    user && (
      <div className="p-6">
        <Avatar imageUrl={user?.imageUrl} />
        <Star star={user?.star} />
        <UserInformation user={user} />
        <CourseHistory userId={params.userId} />
        <DataTable
          columns={columns}
          data={courses}
          canPrintReport={
            checkUser
              .map(
                (item: { permission: { title: any } }) => item.permission.title
              )
              .indexOf("Create personal report") != -1
          }
        />
      </div>
    )
  );
};

export default UserPage;
