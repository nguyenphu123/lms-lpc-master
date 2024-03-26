"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher";

import { SearchInput } from "./search-input";
import { MyCourse } from "./my-course";
import { Notification } from "./notification";
import { ModeToggle } from "./ui/theme-button";
import axios from "axios";

export const NavbarRoutes = ({ userId }: any) => {
  const pathname = usePathname();

  const fetchUserCourses = async () => {
    const { data } = await axios.get(`/api/user/${userId}/progress`);

    return data;
  };
  const { data, error } = useQuery("userCourses", fetchUserCourses);

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    data && (
      <>
        <div>
          {isSearchPage && (
            <div className="hidden md:block">
              <SearchInput />
            </div>
          )}
        </div>
        <div className="flex gap-x-2 ml-auto justify-center">
          <div className="flex items-center">
            <Button size="sm" variant="ghost" asChild>
              <MyCourse data={data} />
            </Button>
            <div className="flex items-center ml-5 mr-3">
              <Notification />
            </div>
            <div className="flex items-center ml-5 mr-3">
              <ModeToggle />
            </div>
          </div>

          {isTeacherPage || isCoursePage ? (
            <Link href="/">
              <Button size="sm" variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </Link>
          ) : isTeacher(userId) ? (
            <Link href="/teacher/programs">
              <Button size="sm" variant="ghost">
                Teacher mode
              </Button>
            </Link>
          ) : null}
          <UserButton afterSignOutUrl="/" />
        </div>
      </>
    )
  );
};
