"use client";

import { PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  courseId: string;
}

export const CourseSidebarItem = ({
  label,
  id,
  courseId,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useParams();

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };
console.log("Module ID:",id)
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4 dark:text-gray-50">
        <PlayCircle
          size={22}
          className={cn(
            "text-slate-500",
            pathname?.includes(id) && "text-slate-700"
          )}
        />
        <span className="break-words max-w-[200px] text-left">{label}</span>
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          pathname?.includes(id) && "opacity-100",
          !pathname?.includes(id) && "border-emerald-700"
        )}
      />
    </button>
  );
};
