"use client";
import { NavbarRoutesPending } from "@/components/navbar-routes-pending";

import { useRouter } from "next/navigation";
interface CourseNavbarProps {
  userId: any;
}

export const BasicNavbar = ({ userId }: CourseNavbarProps) => {
  const router = useRouter();

  return (
    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm">
      <NavbarRoutesPending userId={userId} />
    </div>
  );
};
