"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { DepartmentActionCell } from "@/components/ui/department-action-cell";

export const columns: ColumnDef<{
  id: string;
  title: string;
  status: string;
}>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Title</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "User",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Department members</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
    cell: ({ row }: any) => {
      const { User } = row.original;

      return (
        <div className="grid grid-cols-3 gap-0">
          {User.map((item: any) => {
            return <div key={item.id}>{item.username}</div>;
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "Action",
    cell: DepartmentActionCell,
  },
];
