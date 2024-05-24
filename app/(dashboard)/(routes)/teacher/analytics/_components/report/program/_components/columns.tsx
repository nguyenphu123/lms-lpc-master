"use client";

import { HTMLProps, useState } from "react";
import { Program } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import { Modal } from "@/components/modals/modal";

export const columns: ColumnDef<Program>[] = [
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
    header: () => {
      return <div>Name</div>;
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
          {new Date(startDate).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "courseWithProgram",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">Program courses</span>
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { courseWithProgram } = row.original;
      const [isModalOpen, setModalOpen] = useState(false);

      const courseTitles = courseWithProgram.map(
        (item: { course: { title: string } }) => item.course.title
      );

      return (
        <>
          <button
            className="text-blue-500 underline"
            onClick={() => setModalOpen(true)}
          >
            Detail ({courseWithProgram.length})
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            title="Program Courses"
            items={courseTitles}
          />
        </>
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
