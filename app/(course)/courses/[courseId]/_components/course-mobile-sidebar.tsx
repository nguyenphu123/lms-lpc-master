import { Menu } from "lucide-react";
import { Module, Course, UserProgress } from "@prisma/client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
  course: Course & {
    Module: (Module & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  isLocked: boolean;
}

export const CourseMobileSidebar = ({
  course,
  progressCount,
  isLocked,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 bg-white dark:bg-slate-950 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0  w-72">
        <CourseSidebar
          isLocked={isLocked}
          course={course}
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  );
};
