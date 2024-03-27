"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";

interface StudentFormProps {
  initialData: { Student: any[] };
  courseId: string;
  Student: any[];
}
const Student = z.object({
  id: z.string(),
  username: z.string(),
});
const formSchema = z.array(Student);

export const StudentAssignForm = ({
  initialData,
  courseId,
  Student,
}: StudentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [studentList, setStudentList] = useState(initialData.Student || []);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData.Student,
  });
  const onChangeDepartmentList = (student: any) => {
    let checkIndex = studentList.map((val: any) => val.id).indexOf(student.id);
    if (checkIndex > -1) {
      let tempList = [...studentList];
      tempList.splice(checkIndex, 1);
      setStudentList([...tempList]);
    } else {
      setStudentList([...studentList, student]);
    }
  };
  // const { isSubmitting, isValid } = form.formState;

  const onSubmit = async () => {
    try {
      await axios.patch(`/api/courses/${courseId}/assign`, {
        studentList,
      });
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        Staff
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
            {Student.map((item, i) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 dark:text-slate-50"
                >
                  <input
                    onClick={() => onChangeDepartmentList(item)}
                    disabled={isEditing ? false : true}
                    value={item.id}
                    type="checkbox"
                    checked={
                      studentList.map((val: any) => val.id).indexOf(item.id) !=
                      -1
                        ? true
                        : false
                    }
                    className="text-blue-500"
                  />
                  <label>{item.username}</label>
                </div>
              );
            })}

            <div className="flex items-center gap-x-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
