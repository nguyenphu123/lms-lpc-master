import { auth } from "@clerk/nextjs";
import { Course } from "@prisma/client";
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { db } from "@/lib/db";

interface CourseSidebarProps {
  course: Course & {
    Module: any[];
  };
  progressCount: number;
  isLocked: boolean;
}

export const CourseSidebar = async (
  { course, progressCount, isLocked }: CourseSidebarProps,

  params: {
    chapterId: any;
    params?: { chapterId: string };
  }
) => {
  const { userId } = auth();
  // const searchParams = useParams();

  if (!userId) {
    return redirect("/");
  }

  // const purchase = await db.purchase.findUnique({
  //   where: {
  //     userId_courseId: {
  //       userId,
  //       courseId: course.id,
  //     }
  //   }
  // });
  return (
    <div className="h-full w-80 border-r flex flex-col overflow-y-auto bg-white dark:bg-slate-950 shadow-sm">
      <div className="p-7 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
      </div>
      <div className="flex flex-col w-full dark:text-gray-50">
        {isLocked ? (
          <></>
        ) : (
          course.Module.map((module: any, index: any) => (
            <CourseSidebarItem
              key={module.id}
              id={module.id}
              label={module.title}
              isCompleted={module.UserProgress[0]?.status}
              courseId={course.id}
              isLocked={
                (course.Module[index - 1]?.UserProgress[0]?.status !=
                  "finished" &&
                  index > 0) ||
                module.id == params?.chapterId
                  ? true
                  : false
              }
            />
          ))
        )}
      </div>
    </div>
  );
};
