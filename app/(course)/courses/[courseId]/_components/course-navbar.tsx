import { Module, Course, UserProgress } from "@prisma/client";

import { NavbarRoutes } from "@/components/navbar-routes";

import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: Course & {
    Module: (Module & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  userId: any;
}

export const CourseNavbar = ({
  course,
  progressCount,
  userId,
}: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes userId={userId} />
    </div>
  );
};
