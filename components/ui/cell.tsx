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
import { useQuery } from "react-query";

export const Cell = ({ row }: any) => {
  const { id, status } = row.original;
  const router = useRouter();
  const { userId }: any = useAuth();
  const fetchUserPermission = async () => {
    const { data } = await axios.get(`/api/user/${userId}/personalInfo`);
    return data;
  };

  const { data, error, isLoading } = useQuery(
    "userPermission",
    fetchUserPermission
  );
  async function onChangeStatus(id: string, status: string): Promise<void> {
    let values = {
      status: "approved",
    };

    await axios.patch(`/api/user/${id}/status`, values);

    router.refresh();
  }
  async function onChangeStatusBan(id: string, status: string): Promise<void> {
    let values = {
      status: "ban",
    };

    await axios.patch(`/api/user/${id}/status`, values);

    router.refresh();
  }
  async function onDelete(id: string): Promise<void> {
    let values = {
      status: "inActive",
    };

    await axios.patch(`/api/user/${id}/status`, values);

    router.refresh();
  }
  if (isLoading) {
    return <></>;
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-4 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status == "pending" &&
          data.userPermission
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("User management permission") == -1 ? (
            <></>
          ) : (
            <Link href={`/teacher/users/${id}`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          )}
          {status == "approved" ? (
            <DropdownMenuItem onClick={() => onChangeStatusBan(id, status)}>
              <Ban className="h-4 w-4 mr-2" />
              Ban
            </DropdownMenuItem>
          ) : (
            <></>
          )}

          {data.userPermission
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("User approval permission") != -1 &&
          status == "pending" ? (
            <DropdownMenuItem onClick={() => onChangeStatus(id, status)}>
              <BadgeCheck className="h-4 w-4 mr-2" />
              Approve
            </DropdownMenuItem>
          ) : (
            <></>
          )}
          {data.userPermission
            .map(
              (item: { permission: { title: any } }) => item.permission.title
            )
            .indexOf("User approval permission") != -1 && status == "ban" ? (
            <DropdownMenuItem onClick={() => onChangeStatus(id, status)}>
              <BadgeCheck className="h-4 w-4 mr-2" />
              Unban
            </DropdownMenuItem>
          ) : (
            <></>
          )}
          <DropdownMenuItem onClick={() => onDelete(id)}>
            <BadgeX className="h-4 w-4 mr-2" />
            Disable
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};
