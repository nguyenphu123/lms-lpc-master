"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  BadgeCheck,
  Ban,
  BadgeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export const Cell = ({ row }: any) => {
  const { id, status, role } = row.original;
  const router = useRouter();
  const { userId }: any = useAuth();
  async function onChangeStatus(id: string, status: string): Promise<void> {
    let values = {
      status: status == "approved" ? "pending" : "approved",
    };

    await axios.patch(`/api/user/${id}/status`, values);

    router.refresh();
  }
  async function onDelete(id: string): Promise<void> {
    await axios.delete(`/api/user/${id}`);
    router.refresh();
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
        {userId != id && role != "ADMIN" ? (
          status == "approved" ? (
            <DropdownMenuItem>
              <div
                onClick={() => onChangeStatus(id, status)}
                className="flex items-center"
              >
                <Ban className="h-4 w-4 mr-2" />
                <span>Ban</span>
              </div>
            </DropdownMenuItem>
          ) : (
            <div>
              <DropdownMenuItem>
                <div
                  onClick={() => onChangeStatus(id, status)}
                  className="flex items-center"
                >
                  <BadgeCheck className="h-4 w-4 mr-2" />
                  Approved
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div onClick={() => onDelete(id)} className="flex items-center">
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
};
