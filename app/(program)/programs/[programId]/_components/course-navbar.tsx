
import { NavbarRoutes } from "@/components/navbar-routes";
import dynamic from "next/dynamic";

const Logo = dynamic(() => import("./logo" as string), { ssr: false });
export const CourseNavbar = ({ userId }: any) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm">
      <div className="p-6">
        <Logo />
      </div>

      <NavbarRoutes userId={userId} />
    </div>
  );
};
