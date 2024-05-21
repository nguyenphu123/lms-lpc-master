"use client";

import { Module } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { CourseActionCell } from "@/components/ui/course-action-cell";

import { ExamTitleCell } from "@/components/ui/exam-title-cell";
import { ExamActionCell } from "@/components/ui/exam-action-cell";

export const columns: ColumnDef<Module>[] = [
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
    accessorKey: "title",
    header: "Detail",
    cell: ExamTitleCell,
  },
  {
    id: "actions",
    accessorKey: "Action",
    cell: ExamActionCell,
  },
];
