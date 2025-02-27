import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
// import { getProgress } from "@/actions/get-progress";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId }: any = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      ModuleInCourse: {
        where: {
          module: {
            isPublished: true, // Ensure modules are published
          },
        },
        include: {
          module: true, // Include module details like title, description, etc.
        },
        orderBy: {
          position: "asc", // Ensure modules are ordered correctly
        },
      },
      ExamInCourse: {
        include: {
          exam: true, 
        },
      },
      ClassSessionRecord: true,
    },
  });

  if (!course) {
    return redirect("/");
  }

  // const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-full pl-1">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar
          // progressCount={progressCount}
          course={course}
          userId={userId}
          // isLocked={
          //   course.ClassSessionRecord.map(
          //     (item: { userId: any }) => item.userId
          //   ).indexOf(userId) == -1
          //     ? true
          //     : false
          // }
        />
      </div>
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          // progressCount={progressCount}
          course={course}
          // isLocked={
          //   course.ClassSessionRecord.map(
          //     (item: { userId: any }) => item.userId
          //   ).indexOf(userId) == -1
          //     ? true
          //     : false
          // }
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
