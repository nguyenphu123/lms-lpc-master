"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import axios from "axios";
import { Accordion, AccordionItem } from "@nextui-org/react";

export const ProgramTitleCell = ({ row }: any) => {
  const { id, title, status, courseWithProgram } = row.original;

  const { userId }: any = useAuth();
  const fetchUserPermission = async () => {
    const { data } = await axios.get(`/api/user/${userId}/personalInfo`);

    return data;
  };

  const { data, error, isLoading } = useQuery(
    "userPermission",
    fetchUserPermission
  );
  // console.log(data);
  if (isLoading) {
    return <></>;
  } else {
    return data.userPermission
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Edit course permission") != -1 ? (
      <Accordion>
        <AccordionItem
          key="1"
          aria-label={title}
          title={title}
          className="dark:text-slate-50 justify-between w-3/5"
        >
          {courseWithProgram.map((item: any) => {
            return <>{item.course.title}</>;
          })}
        </AccordionItem>
      </Accordion>
    ) : (
      <>{title}</>
    );
  }
};
