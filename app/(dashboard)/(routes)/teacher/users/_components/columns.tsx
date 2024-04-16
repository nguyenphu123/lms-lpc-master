"use client";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  BadgeCheck,
  Ban,
  BadgeX,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import Image from "next/image";

import { useAuth, useUser } from "@clerk/nextjs";
import { getAuth } from "@/actions/get-auth";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: () => {
      return <div>Name</div>;
    },
    cell: ({ row }) => {
      const { username, imageUrl }: any = row.original;

      return (
        <div className="flex items-center">
          <Image
            src={imageUrl === null ? "/figure_605.png" : imageUrl}
            alt={username}
            height={32}
            width={32}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>{username}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Email</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },

  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Department</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Role</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },

  {
    accessorKey: "star",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Star</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Status</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "Action",
    cell: ({ row }) => {
      const { id, status, role } = row.original;

      async function onChangeStatus(id: string, status: string): Promise<void> {
        let values = {
          status: status == "approved" ? "pending" : "approved",
        };

        await axios.patch(`/api/user/${id}/status`, values);
      }
      async function onDelete(id: string): Promise<void> {
        await axios.delete(`/api/user/${id}`);
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/users/${id}`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            {role != "ADMIN" ? (
              status == "approved" ? (
                <DropdownMenuItem>
                  <div onClick={() => onChangeStatus(id, status)}>
                    <Ban className="h-4 w-4 mr-2" />
                    Ban
                  </div>
                </DropdownMenuItem>
              ) : (
                <div>
                  <DropdownMenuItem>
                    <div onClick={() => onChangeStatus(id, status)}>
                      <BadgeCheck className="h-4 w-4 mr-2" />
                      Approved
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div onClick={() => onDelete(id)}>
                      <BadgeX className="h-4 w-4 mr-2" />
                      Delete
                    </div>
                  </DropdownMenuItem>
                </div>
              )
            ) : (
              <></>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
