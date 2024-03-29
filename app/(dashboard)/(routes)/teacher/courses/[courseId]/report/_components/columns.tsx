"use client";
 
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, ClipboardList } from "lucide-react";
import Link from "next/link";
 
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
 
export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "username",
    header: () => {
      return <div>Name</div>;
    },
    cell: ({ row }) => {
      const { username, imageUrl }: any = row.original;
 
      return (
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt={username}
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
    accessorKey: "progress",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="mr-2">Progress</span>
          <ArrowUpDown className="h-4 w-4" />
        </span>
      );
    },
  },
  // {
  //   accessorKey: "isPublished",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Published
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const isPublished = row.getValue("isPublished") || false;
 
  //     return (
  //       <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
  //         {isPublished ? "Published" : "Draft"}
  //       </Badge>
  //     );
  //   },
  // },
  // {
  //   id: "actions",
  //   accessorKey: "Action",
  //   cell: ({ row }) => {
  //     const { id } = row.original;
 
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-4 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <Link href={`/teacher/courses/${id}`}>
  //             <DropdownMenuItem>
  //               <Pencil className="h-4 w-4 mr-2" />
  //               Edit
  //             </DropdownMenuItem>
  //           </Link>
  //           <Link href={`/teacher/courses/${id}/report`}>
  //             <DropdownMenuItem>
  //               <ClipboardList className="h-4 w-4 mr-2" />
  //               Report
  //             </DropdownMenuItem>
  //           </Link>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];