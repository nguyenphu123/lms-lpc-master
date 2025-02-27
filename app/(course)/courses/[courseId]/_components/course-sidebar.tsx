import { auth } from "@clerk/nextjs";
import { Course } from "@prisma/client";
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { db } from "@/lib/db";

interface CourseSidebarProps {
  course: Course & {
    ModuleInCourse: any[];
  };
}

export const CourseSidebar = async (
  { course }: CourseSidebarProps, // Removed progressCount and isLocked
  params: {
    chapterId: any;
    params?: { chapterId: string };
  }
) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="h-full w-80 border-r flex flex-col overflow-y-auto bg-white dark:bg-slate-950 shadow-sm">
      <div className="p-7 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
      </div>

      <div className="flex flex-col w-full dark:text-gray-50">
        {course.ModuleInCourse.map((moduleItem) => (
          <CourseSidebarItem
            key={moduleItem.id}
            id={moduleItem.module?.id}
            label={moduleItem.module?.title || "Untitled Module"}  // Make sure to access module.title correctly
            courseId={course.id}
          />
        ))}
      </div>


    </div>
  );

};

