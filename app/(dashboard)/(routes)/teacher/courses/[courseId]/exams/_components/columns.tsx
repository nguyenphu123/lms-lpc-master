"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { CourseActionCell } from "@/components/ui/course-action-cell";

import { ExamTitleCell } from "@/components/ui/exam-title-cell";
import { ExamActionCell } from "@/components/ui/exam-action-cell";

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
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Detail</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
    cell: ExamTitleCell,
  },
  {
    id: "actions",
    accessorKey: "Action",
    cell: ExamActionCell,
  },
];
