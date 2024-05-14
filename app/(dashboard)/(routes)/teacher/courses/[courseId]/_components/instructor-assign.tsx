"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Asterisk, Pencil, TrendingUp } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";

interface InstructorFormProps {
  initialData: { Instructor: any[] };
  courseId: string;
  Instructor: any[];
}
const Instructor = z.object({
  id: z.string(),
  username: z.string(),
});
const formSchema = z.array(Instructor);

export const InstructorAssignForm = ({
  initialData,
  courseId,
  Instructor,
}: InstructorFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [instructorList, setInstructorList] = useState(Instructor);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData.Instructor,
  });
  const onChangeInstructorList = async (i: any) => {
    let newList = [...instructorList];
    for (let i = 0; i < newList.length; i++) {
      newList[i].isAssign = false;
    }
    newList[i].isAssign = true;
    // if (newList[i].isAssign) {
    //   newList[i].isAssign = false;
    // } else {
    //   newList[i].isAssign = true;
    // }
    setInstructorList(newList);
  };
  // const { isSubmitting, isValid } = form.formState;

  const onSubmit = async () => {
    try {
      await axios.patch(`/api/courses/${courseId}/assign`, {
        instructorList,
      });
      toast.success("Instructor Assigned");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        <div className="flex items-center">
          Instructor
          {/* <Asterisk className="size-4" color="red" /> */}
        </div>

        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {instructorList.map((item, i) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 dark:text-slate-50"
                >
                  <input
                    onClick={() => onChangeInstructorList(i)}
                    disabled={isEditing ? false : true}
                    value={item.id}
                    type="radio"
                    checked={item.isAssign}
                    className="text-blue-500"
                  />
                  <label>
                    {item.username}({item.Department.title})
                  </label>
                </div>
              );
            })}

            <div className="flex items-center gap-x-2">
              <Button type="submit" onClick={() => onSubmit()}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
