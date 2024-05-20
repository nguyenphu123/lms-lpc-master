"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export const AlertInExam = ({ courseId, moduleId }: any) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  function backToTest() {
    router.push(`/courses/${courseId}/chapters/${moduleId}`);
  }
  if (!isMounted) {
    return null;
  }
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Note</AlertDialogTitle>
          <AlertDialogDescription>
            Sorry you are currently doing test!!!
          </AlertDialogDescription>
          <AlertDialogAction asChild>
            <button className="Button red" onClick={() => backToTest()}>
              Back to exam
            </button>
          </AlertDialogAction>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
