"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
  HTMLProps,
} from "react";

export const columns: ColumnDef<Course>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Name of Course</span>
        </span>
      );
    },
  },
  // {
  //   accessorKey: "user",
  //   header: ({ column }) => {
  //     return (
  //       <span
  //         className="flex items-center cursor-pointer"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <span className="mr-2">Created By</span>
  //       </span>
  //     );
  //   },
  //   cell: ({ row }: any) => {
  //     const { user } = row.original;
  //     return <div>{user.username}</div>;
  //   },
  // },
  // {
  //   accessorKey: "updatedUser",
  //   header: ({ column }) => {
  //     return (
  //       <span
  //         className="flex items-center cursor-pointer"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <span className="mr-2">Updated By</span>
  //       </span>
  //     );
  //   },
  //   cell: ({ row }: any) => {
  //     const { updatedUser } = row.original;

  //     return <div>{updatedUser?.username} </div>;
  //   },
  // },
  {
    accessorKey: "courseInstructor",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Instructor</span>
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
          <span className="mr-2">Created On</span>
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
          {new Date(startDate).toLocaleDateString("vi-VN", {
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
          <span className="mr-2">Attendees</span>
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
                {item.user.username}:{" "}
                <span
                  className={`${
                    item.status == "finished"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {item.status}
                </span>{" "}
                ({item.progress})
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "Module",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Exams</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { Module } = row.original;

      return (
        <div>
          {Module.map((item: any) => {
            return item.type == "Exam" ? (
              <div key={item.id}>
                {item.title}
                {item.UserProgress.map((item: any) => {
                  return (
                    <div key={item.id}>
                      {item.user.username}:{item.score}%
                    </div>
                  );
                })}
              </div>
            ) : (
              <></>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "Module",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Study pages</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { Module } = row.original;

      return (
        <div>
          {Module.map((item: any) => {
            return item.type == "slide" ? (
              <div key={item.id}>
                {item.title}
                {/* {item.UserProgress.map((item: any) => {
                  return <div key={item.id}>{item.user.username}</div>;
                })} */}
              </div>
            ) : (
              <></>
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
function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
