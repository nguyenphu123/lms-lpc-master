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
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { useEffect, useState } from "react";

export const Cell = ({ row }: any) => {
  const { id, email, username, status } = row.original;
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailAddress = searchParams.get("email");
  const task = searchParams.get("task");
  const { userId }: any = useAuth();
  const [triggerAlert, setTriggerAlert] = useState(false);
  const [userStatus, setUserStatus] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (emailAddress != undefined && task != undefined) {
      if (email == emailAddress) {
        setTriggerAlert(true);
        setUserStatus("approved");
        setMessage(`Are you sure you are going to approve ${username}?`);
      }
    }
  }, []);
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
      status: userStatus,
    };

    await axios.patch(`/api/user/${id}/status`, values);
    setTriggerAlert(false);
    setUserStatus("");
    setMessage("");
    router.refresh();
  }
  function onChangeAlertMessage(status: string, message: string) {
    setTriggerAlert(true);
    setUserStatus(status);
    setMessage(message);
  }
  function cancel() {
    setTriggerAlert(false);
    setUserStatus("");
    setMessage("");
    router.refresh();
  }
  if (isLoading) {
    return <></>;
  } else {
    return (
      <>
        <DropdownMenu modal={false}>
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
              <DropdownMenuItem
                onClick={() =>
                  onChangeAlertMessage(
                    "ban",
                    `Are you sure you are going to ban ${username}?(user data will not be deleted and you can restore status later)`
                  )
                }
              >
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
              <DropdownMenuItem
                onClick={() =>
                  onChangeAlertMessage(
                    "approved",
                    `Are you sure you are going to approve ${username}?`
                  )
                }
              >
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
              <DropdownMenuItem
                onClick={() =>
                  onChangeAlertMessage(
                    "approved",
                    `Are you sure you are going to unban ${username}?`
                  )
                }
              >
                <BadgeCheck className="h-4 w-4 mr-2" />
                Unban
              </DropdownMenuItem>
            ) : (
              <></>
            )}

            <DropdownMenuItem
              onClick={() =>
                onChangeAlertMessage(
                  "inActive",
                  `Are you sure you are going to disable ${username}?(Once disabled, this user data will not be deleted but only root admin can restore user status)`
                )
              }
            >
              <BadgeX className="h-4 w-4 mr-2" />
              Disable
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog
          open={triggerAlert}
          onOpenChange={() => {
            setTimeout(() => (document.body.style.pointerEvents = ""), 100);
          }}
        >
          <AlertDialogContent className="AlertDialogContent">
            <AlertDialogTitle className="AlertDialogTitle">
              {userStatus}
            </AlertDialogTitle>
            <AlertDialogDescription className="AlertDialogDescription">
              {message}
            </AlertDialogDescription>

            <AlertDialogCancel onClick={() => cancel()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                className="Button red"
                onClick={() => onChangeStatus(id, status)}
              >
                Confirm
              </button>
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
};
