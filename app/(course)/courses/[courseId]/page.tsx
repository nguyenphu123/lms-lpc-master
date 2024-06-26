import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId }: any = auth();
  const checkUser = await db.userPermission.findMany({
    where: {
      userId: userId,
    },
    include: {
      permission: true,
    },
  });
  // if (
  //   checkUser
  //     .map((item: { permission: { title: any } }) => item.permission.title)
  //     .indexOf("Study permission") == -1
  // ) {
  //   return redirect("/");
  // }
  const course: any = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      Module: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
        include: {
          UserProgress: {
            where: {
              userId,
            },
          },
        },
      },
      ClassSessionRecord: true,
      CourseOnDepartment: true,
    },
  });

  if (!course) {
    return redirect("/");
  }
  if (
    course.ClassSessionRecord.map(
      (item: { userId: any }) => item.userId
    ).indexOf(userId) == -1
  ) {
    return redirect(`/courses/${course.id}/description`);
  }

  let currentPos = 0;
  for (let i = 0; i < course.Module.length; i++) {
    if (
      course.Module[i].UserProgress.map((item: any) => item.userId).indexOf(
        userId
      ) != -1 &&
      course.Module[i].UserProgress[
        course.Module[i].UserProgress.map((item: any) => item.userId).indexOf(
          userId
        )
      ].status == "studying"
    ) {
      currentPos = i;
      break;
    } else if (
      course.Module[i].UserProgress.map((item: any) => item.userId).indexOf(
        userId
      ) != -1 &&
      course.Module[i].UserProgress[
        course.Module[i].UserProgress.map((item: any) => item.userId).indexOf(
          userId
        )
      ].status == "finished"
    ) {
      currentPos = i;
    }
  }
  return redirect(
    `/courses/${course.id}/chapters/${course.Module[currentPos].id}`
  );
};

export default CourseIdPage;
