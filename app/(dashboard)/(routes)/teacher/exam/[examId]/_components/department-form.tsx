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
  ProgramOnDepartment: any;
}
interface DepartmentFormProps {
  initialData: DepartmentProps[];
  programId: string;
  department: DepartmentProps[];
}
const Department = z.object({
  id: z.string(),
  title: z.string(),
});
const formSchema = z.array(Department);

export const DepartmentForm = ({ initialData, programId, department }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [departmentList, setDepartmentList] = useState(
    initialData.ProgramOnDepartment
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const onChangeDepartmentList = useCallback(
    (e: any, department: DepartmentProps) => {
      // e.preventDefault();
      setDepartmentList((items: DepartmentProps[]) => {
        let checkIndex = items
          .map((val: DepartmentProps) => val.id)
          .indexOf(department.id);
        let checkIndex2 = items
          .map((val: any) => val.departmentId)
          .indexOf(department.id);
        if (checkIndex > -1 || checkIndex2 > -1) {
          let tempList = [...departmentList];
          tempList.splice(checkIndex, 1);

          return [...tempList];
        } else {
          return [...departmentList, department];
        }
      });
    },
    [departmentList]
  );
  // const onChangeDepartmentList = (e: any, department: DepartmentProps) => {

  // };
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async () => {
    try {
      await axios.patch(`/api/programs/${programId}/department`, {
        departmentList,
      });
      toast.success("Program updated");
      // toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        department
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
        <>
          {department.map((item: any, i: any) => {
            return (
              <div key={item.id} className="dark:text-slate-50">
                <input
                  onChange={(e) => onChangeDepartmentList(e, item)}
                  disabled={isEditing ? false : true}
                  value={item.title}
                  type="checkbox"
                  checked={
                    departmentList.map((val: any) => val.id).indexOf(item.id) !=
                      -1 ||
                    departmentList
                      .map((val: any) => val.departmentId)
                      .indexOf(item.id) != -1
                      ? true
                      : false
                  }
                />
                {item.title}
              </div>
            );
          })}
          <div className="flex items-center gap-x-2">
            <Button onClick={() => onSubmit()} type="button">
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
