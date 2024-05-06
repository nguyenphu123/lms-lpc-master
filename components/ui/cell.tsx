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
        {status != "approved" ? (
          <></>
        ) : (
          <Link href={`/teacher/users/${id}`}>
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </Link>
        )}

        {userId != id && (role != "ADMIN" || role != "MANAGER") ? (
          status == "approved" ? (
            <DropdownMenuItem onClick={() => onChangeStatus(id, status)}>
              <Ban className="h-4 w-4 mr-2" />
              Ban
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem onClick={() => onChangeStatus(id, status)}>
                <BadgeCheck className="h-4 w-4 mr-2" />
                Approved
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onDelete(id)}>
                <BadgeX className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )
        ) : (
          <></>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
