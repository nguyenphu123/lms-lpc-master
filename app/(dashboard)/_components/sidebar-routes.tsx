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
  CircuitBoard,
  Cctv,
  Waypoints,
  Building,
  Package,
  FlaskConical,
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
  // {
  //   icon: BookCheck,
  //   label: "Collection",
  //   href: "/collection",
  // },
];

export const SidebarRoutes = ({ userId }: any) => {
  const pathname = usePathname();

  const [teacherRoutes, setTeacherRoutes]: any = useState([]);
  const isTeacherPage = pathname?.includes("/teacher");
  const fetchUserRoutes = async () => {
    const { data } = await axios.get(`/api/user/${userId}/personalInfo`);

    if (
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Create program permission") != -1 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Edit program permission") != -1
    ) {
      setTeacherRoutes((prevState: any) => [
        ...prevState,
        {
          icon: CircuitBoard,
          label: "Programs",
          href: "/teacher/programs",
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
      setTeacherRoutes((prevState: any) => [
        ...prevState,
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
      setTeacherRoutes((prevState: any) => [
        ...prevState,
        {
          icon: BarChart,
          label: "Analytics and Report",
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
        .indexOf("Manage role permission") != -1
    ) {
      setTeacherRoutes((prevState: any) => [
        ...prevState,
        {
          icon: Waypoints,
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
        .indexOf("Manage permission permission") != -1
    ) {
      setTeacherRoutes((prevState: any) => [
        ...prevState,
        {
          icon: Cctv,
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
      setTeacherRoutes((prevState: any) => [
        ...prevState,
        {
          icon: UsersRound,
          label: "Users",
          href: "/teacher/users",
        },
      ]);
      setTeacherRoutes((prevState: any) => [
        ...prevState,
        {
          icon: Building,
          label: "Departments",
          href: "/teacher/departments",
        },
      ]);
      setTeacherRoutes((prevState: any) => [
        ...prevState,
        {
          icon: Package,
          label: "Resources",
          href: "/teacher/resources",
        },
      ]);
    }
    if (
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("User personal management permission") != -1 &&
      guestRoutes.map((item) => item.label).indexOf("Personal Information") ==
        -1
    ) {
      guestRoutes.push({
        icon: UsersRound,
        label: "Personal Information",
        href: `/user/${userId}`,
      });
    }
    return data;
  };
  const { data, error, isLoading } = useQuery("userRoutes", fetchUserRoutes, {
    refetchOnWindowFocus: false,
  });
  if ((isLoading && teacherRoutes.length == 0) || guestRoutes.length == 0) {
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
