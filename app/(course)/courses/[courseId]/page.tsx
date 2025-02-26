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
      ModuleInCourse: {
        where: {
          module: {
            isPublished: true,  // Apply isPublished filter on module relation
          },
        },
        orderBy: {
          position: "asc",
        },
        include: {
          module: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      ClassSessionRecord: true,
      CourseOnDepartment: true,
    },
  });
  console.log(course)
  if (!course) {
    return redirect("/");
  }
  
  // Check if the user is part of the class session
  if (
    course.ClassSessionRecord.map(
      (item: { userId: any }) => item.userId
    ).indexOf(userId) === -1
  ) {
    return redirect(`/courses/${course.id}/description`);
  }

  // Determine the current position of the user
  let currentPos = 0;
  for (let i = 0; i < course.ModuleInCourse.length; i++) {
    // Simply set the current position to the last available module if needed
    currentPos = i; 
  }

  return redirect(
    `/courses/${course.id}/chapters/${course.ModuleInCourse[currentPos].module.id}`
  );
};

export default CourseIdPage;
