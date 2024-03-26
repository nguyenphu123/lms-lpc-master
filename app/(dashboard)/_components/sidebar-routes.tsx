"use client";

import {
  BarChart,
  Compass,
  Group,
  Layout,
  Home,
  BookCheck,
  List,
  Star,
  UsersRound,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";

const guestRoutes = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
  {
    icon: Star,
    label: "Bright Star",
    href: "/ranking",
  },
  {
    icon: BookCheck,
    label: "Collection",
    href: "/collection",
  },
];

export const SidebarRoutes = ({ userId }: any) => {
  const pathname = usePathname();

  const [teacherRoutes, setTeacherRoutes] = useState([
    {
      icon: Group,
      label: "Programs",
      href: "/teacher/programs",
    },
    {
      icon: List,
      label: "Courses",
      href: "/teacher/courses",
    },

    {
      icon: BarChart,
      label: "Analytics",
      href: "/teacher/analytics",
    },
  ]);
  const isTeacherPage = pathname?.includes("/teacher");
  const fetchUserRoutes = async () => {
    const { data } = await axios.get(`/api/user/${userId}`);

    if (data.role != "admin") {
    } else {
      setTeacherRoutes([
        ...teacherRoutes,
        {
          icon: UsersRound,
          label: "Users",
          href: "/teacher/users",
        },
      ]);
    }

    return data;
  };
  const { data, error } = useQuery("userRoutes", fetchUserRoutes, {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col w-full dark:text-gray-50">
      {isTeacherPage
        ? teacherRoutes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
            />
          ))
        : guestRoutes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
            />
          ))}
    </div>
  );
};
