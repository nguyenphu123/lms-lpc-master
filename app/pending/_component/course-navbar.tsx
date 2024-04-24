"use client";
import { NavbarRoutesPending } from "@/components/navbar-routes-pending";
import { useChannel } from "ably/react";
import { useRouter } from "next/navigation";
interface CourseNavbarProps {
  userId: any;
}

export const BasicNavbar = ({ userId }: CourseNavbarProps) => {
  const router = useRouter();
  const { channel, ably } = useChannel("user:approval", (message: any) => {
    if (message.data.type == "user-approval") {
      if (message.data.userId == userId && message.data.status == "approved") {
        router.push(`/`);
        router.refresh();
      }
    }
  });
  return (
    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm">
      <NavbarRoutesPending userId={userId} />
    </div>
  );
};
