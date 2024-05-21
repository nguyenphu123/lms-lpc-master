"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from "react";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Title</span>
        </span>
      );
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Created By</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { user } = row.original;
      return <div>{user.username}</div>;
    },
  },
  {
    accessorKey: "updatedUser",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Updated By</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { updatedUser } = row.original;

      return <div>{updatedUser?.username} </div>;
    },
  },
  {
    accessorKey: "courseInstructor",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Instructed By</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { courseInstructor } = row.original;

      return <div>{courseInstructor?.username} </div>;
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Created date</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { startDate } = row.original;

      return (
        <div>
          {new Date(startDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          {new Date(startDate).toLocaleDateString([], {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
        </div>
      );
    },
  },
  {
    accessorKey: "ClassSessionRecord",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Course participant</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { ClassSessionRecord } = row.original;

      return (
        <div>
          {ClassSessionRecord.map((item: any) => {
            return (
              <div key={item.id}>
                {item.user.username}:
                <span
                  className={`${
                    item.status == "finished"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {item.status}
                </span>
                ({item.progress})
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "CourseOnDepartment",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Course for</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { CourseOnDepartment } = row.original;

      return (
        <div>
          {CourseOnDepartment.map((item: any) => {
            return <div key={item.id}>{item.Department.title}</div>;
          })}
        </div>
      );
    },
  },
];
