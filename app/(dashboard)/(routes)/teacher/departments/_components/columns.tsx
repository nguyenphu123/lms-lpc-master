"use client"; // Ensure this is at the top of your file

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { DepartmentActionCell } from "@/components/ui/department-action-cell";
import { Modal } from "@/components/modals/modal"; // Import your modal component

export const columns: ColumnDef<{
  id: string;
  title: string;
  status: string;
  User: { id: string; username: string }[];
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
      const [isModalOpen, setModalOpen] = useState(false);

      const memberNames = User.map(
        (member: { username: string }) => member.username
      );

      return (
        <>
          <button
            className="text-blue-500 underline"
            onClick={() => setModalOpen(true)}
          >
            Detail ({User.length})
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            title="Department Members"
            items={memberNames}
          />
        </>
      );
    },
  },
];
