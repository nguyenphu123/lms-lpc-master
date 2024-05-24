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
import { useState } from "react";
import { Modal } from "../modals/modal";

export const DepartmentUserCell = ({ row }: any) => {
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
};
