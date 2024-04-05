import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId }: any = auth();
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
    },
  });

  if (!course) {
    return redirect("/");
  }
  if (
    course.ClassSessionRecord.map(
      (item: { userId: any }) => item.userId
    ).indexOf(userId)
  ) {
    return redirect("/");
  }
  return redirect(`/courses/${course.id}/chapters/${course.Module[0].id}`);
};

export default CourseIdPage;
