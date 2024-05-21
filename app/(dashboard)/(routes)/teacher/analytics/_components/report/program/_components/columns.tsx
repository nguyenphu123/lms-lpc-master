"use client";

import { Program } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from "react";

export const columns: ColumnDef<Program>[] = [
  {
    accessorKey: "title",
    header: () => {
      return <div>Name</div>;
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
    accessorKey: "courseWithProgram",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">Program's courses</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { courseWithProgram } = row.original;

      return courseWithProgram.length > 0 ? (
        <div>
          {courseWithProgram.map(
            (item: {
              course: {
                title:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | PromiseLikeOfReactNode
                  | null
                  | undefined;
              };
            }) => {
              return <div>{item.course.title}</div>;
            }
          )}
        </div>
      ) : (
        <div>No course</div>
      );
    },
  },
];
