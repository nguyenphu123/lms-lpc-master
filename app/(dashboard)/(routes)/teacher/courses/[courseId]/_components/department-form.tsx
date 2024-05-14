"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Accordion, AccordionItem } from "@nextui-org/react";
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
  const [assignList, setAssignList]: any = useState([]);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData.Department,
  });
  useEffect(() => {
    let newAssignList: any = [...assignList];
    for (let i = 0; i < departmentList.length; i++) {
      let users = departmentList[i].User;
      for (let j = 0; j < users.length; j++) {
        newAssignList.push(users[j]);
      }
    }
    setAssignList(newAssignList);
  }, []);
  const onChangeDepartmentList = (
    e: any,
    department: DepartmentProps,
    index: any
  ) => {
    // e.preventDefault();

    let newList = [...departmentList];
    let newAssignList: any = [...assignList];

    if (newList[index].isEnrolled) {
      newList[index].isEnrolled = false;
      for (let i = 0; i < newList[index].User.length; i++) {
        newList[index].User[i].isEnrolled = false;
        newAssignList[
          newAssignList
            .map((item: { id: any }) => item.id)
            .indexOf(newList[index].User[i].id)
        ].isEnrolled = false;
      }
    } else {
      newList[index].isEnrolled = true;
      for (let i = 0; i < newList[index].User.length; i++) {
        newList[index].User[i].isEnrolled = true;
        newAssignList[
          newAssignList
            .map((item: { id: any }) => item.id)
            .indexOf(newList[index].User[i].id)
        ].isEnrolled = true;
      }
    }
    setAssignList([...newAssignList]);

    setDepartmentList([...newList]);
  };
  const onChangeStudentList = async (
    e: any,
    department: DepartmentProps,
    i: any,
    j: any
  ) => {
    let newList = [...departmentList];
    let newAssignList: any = [...assignList];
    if (newList[i].User[j].isEnrolled) {
      newList[i].User[j].isEnrolled = false;
      newList[i].isEnrolled = false;
      newAssignList[
        newAssignList
          .map((item: { id: any }) => item.id)
          .indexOf(newList[i].User[j].id)
      ].isEnrolled = false;
    } else {
      newList[i].User[j].isEnrolled = true;
      newAssignList[
        newAssignList
          .map((item: { id: any }) => item.id)
          .indexOf(newList[i].User[i].id)
      ].isEnrolled = true;
    }
    setAssignList(newAssignList);

    setDepartmentList(newList);
  };
  // const { isSubmitting, isValid } = form.formState;

  const onSubmit = async () => {
    try {
      await axios.patch(`/api/courses/${courseId}/department`, {
        departmentList,
        assignList,
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
            {departmentList.map((item: any, i: any) => {
              return (
                <div key={item.id} className=" justify-between">
                  <Accordion>
                    <AccordionItem
                      className=" dark:text-slate-50"
                      key={item.id}
                      aria-label={item.title}
                      startContent={
                        <>
                          <input
                            id={"department " + item.id}
                            onChange={(e) => onChangeDepartmentList(e, item, i)}
                            disabled={isEditing ? false : true}
                            value={item.title}
                            type="checkbox"
                            checked={item.isEnrolled}
                            defaultChecked={item.isEnrolled}
                          />
                          {item.title}
                        </>
                      }
                    >
                      <div
                        key={"department-user " + item.id}
                        className="grid grid-cols-2 gap-2 w-full"
                      >
                        {item.User.map((item: any, j: any) => {
                          return (
                            <div
                              key={item.id}
                              className="flex items-center space-x-2 p-2 dark:text-slate-50 bg-white dark:bg-gray-800 rounded-lg shadow"
                            >
                              <input
                                id={"user " + item.id}
                                onChange={(e) =>
                                  onChangeStudentList(e, item, i, j)
                                }
                                disabled={isEditing ? false : true}
                                value={item.title}
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
                                checked={item.isEnrolled}
                                defaultChecked={item.isEnrolled}
                              />
                              <span>{item.username}</span>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionItem>
                  </Accordion>
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
