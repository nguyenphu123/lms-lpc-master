"use client";

import axios from "axios";

import { useRouter } from "next/navigation";

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
import { useState } from "react";

export const CellUserExamStatus = ({ row }: any) => {
  const { id, userExamReport } = row.original;

  const router = useRouter();
  const [note, setNote] = useState("");

  const { userId }: any = useAuth();

  const fetchUserCourse = async () => {
    const { data } = await axios.get(`/api/user/${id}/coursesSession`);
    return data;
  };

  const { data, error, isLoading } = useQuery("userCourse", fetchUserCourse, {
    refetchOnWindowFocus: false,
  });
  async function onChangeStatus(id: string): Promise<void> {
    await axios.patch(`/api/user/${id}/isInExam`, {
      values: {
        isInExam: false,
        note: note,
      },
    });

    router.refresh();
  }

  if (isLoading) {
    return <></>;
  } else {
    return !userExamReport[0]?.isInExam ? (
      <div className="font-bold ml-2 rounded-lg">
        This user is not taking any exam
      </div>
    ) : (
      <AlertDialog
        onOpenChange={() => {
          setTimeout(() => (document.body.style.pointerEvents = ""), 100);
        }}
      >
        <AlertDialogTrigger className="flex justify-center items-center">
          <div className="font-bold ml-2 rounded-lg">
            This user is taking the {userExamReport[0].module.title} of{" "}
            {userExamReport[0].course.title}
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="AlertDialogContent">
          <AlertDialogTitle className="AlertDialogTitle">
            Reset user exam?
          </AlertDialogTitle>
          <AlertDialogDescription className="AlertDialogDescription">
            Are you sure you want to reset this user exam status?
            <br />
            Please following these steps before confirmination:
            <br />
            1. Checking if user having issue that require the exam to be reset.
            <br />
            2. Consult with exam supervisor.
            <br />
            3. If the reset is confirm, please fill the below form to record the
            incident.
            <br />
            <div>
              <label htmlFor="note">Note</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
          </AlertDialogDescription>

          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button className="Button red" onClick={() => onChangeStatus(id)}>
              Confirm
            </button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
};
