import { ModuleInCourse, Course } from "@prisma/client";
import { NavbarRoutes } from "@/components/navbar-routes";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: Course & {
    ModuleInCourse: any[];
  };
  userId: any;
}

export const CourseNavbar = ({
  course,
  userId,
}: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm">
      <CourseMobileSidebar course={course} />
      <NavbarRoutes userId={userId} />
    </div>
  );
};
