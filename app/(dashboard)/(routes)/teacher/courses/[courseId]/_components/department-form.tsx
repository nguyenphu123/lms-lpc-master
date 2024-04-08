"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface DepartmentProps {
  id: string;
  title: string;
}
interface DepartmentFormProps {
  initialData: { Department: DepartmentProps[] };
  courseId: string;
  department: DepartmentProps[];
}
const Department = z.object({
  id: z.string(),
  title: z.string(),
});
const formSchema = z.array(Department);

export const DepartmentForm = ({ initialData, courseId, department }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [departmentList, setDepartmentList] = useState(department);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData.Department,
  });

  const onChangeDepartmentList = (
    e: any,
    department: DepartmentProps,
    index: any
  ) => {
    // e.preventDefault();
    let newList = [...departmentList];

    if (newList[index].isEnrolled) {
      newList[index].isEnrolled = false;
    } else {
      newList[index].isEnrolled = true;
    }
    setDepartmentList(newList);
  };

  // const { isSubmitting, isValid } = form.formState;

  const onSubmit = async () => {
    try {
      await axios.patch(`/api/courses/${courseId}/department`, {
        departmentList,
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
        Department
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
            {department.map((item: any, i: any) => {
              return (
                <div key={item.id} className="dark:text-slate-50">
                  <input
                    onChange={(e) => onChangeDepartmentList(e, item, i)}
                    disabled={isEditing ? false : true}
                    value={item.title}
                    type="checkbox"
                    defaultChecked={item.isEnrolled}
                  />
                  {item.title}
                </div>
              );
            })}

            <div className="flex items-center gap-x-2">
              <Button onClick={() => onSubmit()}>Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
