import { NavbarRoutesPending } from "@/components/navbar-routes-pending";

interface CourseNavbarProps {
  userId: any;
}

export const BasicNavbar = ({ userId }: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm">
      <NavbarRoutesPending userId={userId} />
    </div>
  );
};
