// @refresh reset
"use client";

import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Accordion, AccordionItem } from "@nextui-org/react";
import React, { HTMLProps } from "react";

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "username",
    header: () => <div>Name</div>,
    cell: ({ row }) => {
      const { username }: any = row.original;
      return (
        <div className="flex items-center">
          <div>{username}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <span className="flex items-center cursor-pointer">
        <span className="mr-2">Department</span>
      </span>
    ),
    cell: ({ row }) => {
      const { Department }: any = row.original;
      return (
        <div className="flex items-center">
          <div>{Department.title}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "star",
    header: ({ column }) => (
      <span className="flex items-center cursor-pointer">
        <span className="mr-2">Star</span>
      </span>
    ),
  },
  {
    accessorKey: "departmentId",
    header: ({ column }) => (
      <span className="flex items-center cursor-pointer">hidden</span>
    ),
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
