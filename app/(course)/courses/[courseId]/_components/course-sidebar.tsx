import { auth } from "@clerk/nextjs";
import { Course } from "@prisma/client";
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { db } from "@/lib/db";

interface CourseSidebarProps {
  course: Course & {
    ModuleInCourse: any[];
    ExamInCourse: any[]; // Kiểm tra có bài kiểm tra không
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

  // Kiểm tra khóa học có bài kiểm tra không
  const hasExam = course.ExamInCourse && course.ExamInCourse.length > 0;
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
            label={moduleItem.module?.title || "Untitled Module"}
            courseId={course.id}
          />
        ))}

        {/* Hiển thị mục Exam nếu có bài kiểm tra */}
        {hasExam &&
          course.ExamInCourse.map((examItem) => {
            // Console log examItem.id
            return (
              <CourseSidebarItem
                key={examItem.id}  // Sử dụng ID từ ExamInCourse
                id={examItem.exam?.id}  // Truyền ID bài kiểm tra
                label={examItem.exam?.title || "Untitled Exam"}  // Đặt tên bài kiểm tra
                courseId={course.id}
              />
            );
          })}
      </div>
    </div>
  );
};
