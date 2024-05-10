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

  const [teacherRoutes, setTeacherRoutes]: any = useState([]);
  const isTeacherPage = pathname?.includes("/teacher");
  const fetchUserRoutes = async () => {
    const { data } = await axios.get(`/api/user/${userId}`);
    if (
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Create program permission") != -1 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Edit program permission") != -1
    ) {
      setTeacherRoutes([
        ...teacherRoutes,
        {
          icon: UsersRound,
          label: "Users",
          href: "/teacher/users",
        },
      ]);
    }
    if (
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Create course permission") != -1 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Edit course permission") != -1
    ) {
      setTeacherRoutes([
        ...teacherRoutes,
        {
          icon: List,
          label: "Courses",
          href: "/teacher/courses",
        },
      ]);
    }
    if (
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Create program report") != -1 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Create course report") != -1 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Create exam report") != -1
    ) {
      setTeacherRoutes([
        ...teacherRoutes,
        {
          icon: BarChart,
          label: "Analytics",
          href: "/teacher/analytics",
        },
      ]);
    }
    if (
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Create role permission") != -1 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Edit role permission") != -1
    ) {
      setTeacherRoutes([
        ...teacherRoutes,
        {
          icon: BarChart,
          label: "Roles",
          href: "/teacher/roles",
        },
      ]);
    }
    if (
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Create permission permission") != -1 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Edit permission permission") != -1
    ) {
      setTeacherRoutes([
        ...teacherRoutes,
        {
          icon: BarChart,
          label: "Permissions",
          href: "/teacher/permissions",
        },
      ]);
    }
    if (
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("User approval permission") != -1 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("User management permission") != -1
    ) {
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
  const { data, error, isLoading } = useQuery("userRoutes", fetchUserRoutes, {
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <></>;
  } else {
    return (
      <div className="flex flex-col w-full dark:text-gray-50">
        {isTeacherPage
          ? teacherRoutes.map((route: any) => (
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
  }
};
