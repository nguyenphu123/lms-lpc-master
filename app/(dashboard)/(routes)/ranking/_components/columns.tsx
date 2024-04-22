"use client";
import Image from "next/image";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import "@/css/fire.css";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "order",
    header: "Top",
    cell: ({ row }) => {
      const order = row.index + 1;
      let colorClass = "";

      switch (order) {
        case 1:
          colorClass = "Blazing";
          break;
        case 2:
          colorClass = "text-white";
          break;
        case 3:
          colorClass = "text-white";
          break;
        default:
          colorClass = "text-black dark:text-white";
      }

      return <div className={`font-bold ${colorClass}`}>{order}</div>;
    },
  },
  {
    accessorKey: "username",
    header: () => {
      return <div>Name</div>;
    },
    cell: ({ row }) => {
      const order = row.index + 1;
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

          {order == 1 ? <div>{username}</div> : <div>{username}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <span className="flex items-center">
          <span className="mr-2">Department</span>
        </span>
      );
    },
  },
  {
    accessorKey: "star",
    header: () => {
      return <div>Star</div>;
    },
    cell: ({ row }) => {
      const stars = row.original.star || 0;
      const starString = stars + " ⭐";

      return <div>{starString}</div>;
    },
  },
  // {
  //   accessorKey: "price",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Price
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     const price = parseFloat(row.getValue("price") || "0");
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD"
  //     }).format(price);

  //     return <div>{formatted}</div>
  //   }
  // },
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
];
