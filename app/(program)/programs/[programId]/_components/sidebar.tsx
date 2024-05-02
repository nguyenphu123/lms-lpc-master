import dynamic from "next/dynamic";
import { SidebarRoutes } from "./sidebar-routes";
const Logo = dynamic(() => import("./logo" as string), { ssr: false });
export const Sidebar = ({ userId }: any) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white dark:bg-slate-950 shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col w-full dark:text-gray-50">
        <SidebarRoutes userId={userId} />
      </div>
    </div>
  );
};
