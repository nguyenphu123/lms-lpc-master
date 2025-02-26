import { Menu } from "lucide-react";
import { Module, Course } from "@prisma/client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
  course: Course & {
    ModuleInCourse: any[];
  };
}

export const CourseMobileSidebar = ({
  course,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 bg-white dark:bg-slate-950 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <CourseSidebar course={course} />
      </SheetContent>
    </Sheet>
  );
};
