"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader, Pencil } from "lucide-react";
import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useState,
} from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [departmentList, setDepartmentList] = useState([...department]);
  const [assignList, setAssignList]: any = useState([]);
  const [triggerAlert, setTriggerAlert] = useState(false);

  const [loading, setLoading] = useState(false);
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
  const onChangeDepartmentList = (index: any) => {
    // e.preventDefault();

    let newList = [...departmentList];
    let newAssignList: any = [...assignList];

    if (newList[index].isEnrolled) {
      if (newList[index].canUndo) {
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
        alert("Cannot commit this action!!!");
        return;
      }
    } else {
      if (newList[index].User.length == 0) {
        alert("No user to assign!!!");
        return;
      }
      newList[index].isEnrolled = true;
      newList[index].canUndo = true;
      for (let i = 0; i < newList[index].User.length; i++) {
        newList[index].User[i].isEnrolled = true;
        newList[index].User[i].canUndo = true;
        newAssignList[
          newAssignList
            .map((item: { id: any }) => item.id)
            .indexOf(newList[index].User[i].id)
        ].isEnrolled = true;
        newAssignList[
          newAssignList
            .map((item: { id: any }) => item.id)
            .indexOf(newList[index].User[i].id)
        ].canUndo = true;
      }
    }
    setAssignList([...newAssignList]);

    setDepartmentList([...newList]);
  };
  const onChangeStudentList = async (i: any, j: any) => {
    let newList = [...departmentList];
    let newAssignList: any = [...assignList];
    if (newList[i].User[j].isEnrolled) {
      if (newList[i].User[j].canUndo) {
        newList[i].User[j].isEnrolled = false;
        newList[i].isEnrolled = false;
        newAssignList[
          newAssignList
            .map((item: { id: any }) => item.id)
            .indexOf(newList[i].User[j].id)
        ].isEnrolled = false;
      } else {
        alert("Cannot commit this action!!!");
        return;
      }
    } else {
      newList[i].User[j].isEnrolled = true;
      newList[i].User[j].canUndo = true;
      newAssignList[
        newAssignList
          .map((item: { id: any }) => item.id)
          .indexOf(newList[i].User[j].id)
      ].isEnrolled = true;
      newAssignList[
        newAssignList
          .map((item: { id: any }) => item.id)
          .indexOf(newList[i].User[j].id)
      ].canUndo = true;
    }
    setAssignList(newAssignList);
    if (
      newList[i].User.map((item: any) => item.isEnrolled).indexOf(false) == -1
    ) {
      newList[i].isEnrolled = true;
      newList[i].canUndo = true;
    }
    setDepartmentList(newList);
  };
  // const { isSubmitting, isValid } = form.formState;
  function cancel() {
    setTriggerAlert(false);

    router.refresh();
  }
  const onSubmit = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/courses/${courseId}/department`, {
        departmentList,
        assignList,
      });
      toast.success("Course updated");
      setLoading(false);
      setTriggerAlert(false);
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };
  const onConfirm = () => {
    let canSubmit = false;
    for (let i = 0; i < assignList.length; i++) {
      if (assignList[i].isEnrolled == true && assignList[i].canUndo == true) {
        canSubmit = true;
      }
    }
    if (canSubmit) {
      setTriggerAlert(true);
    } else {
      alert("No new staffs assigned to this course!!!");
      return;
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <AlertDialog
        open={triggerAlert}
        onOpenChange={() => {
          setTimeout(() => (document.body.style.pointerEvents = ""), 100);
        }}
      >
        <AlertDialogContent className="AlertDialogContent">
          <AlertDialogTitle className="AlertDialogTitle">
            Submit list of staff assigned to course
          </AlertDialogTitle>
          <AlertDialogDescription className="AlertDialogDescription">
            Are you sure you want to add these attendees to this course?(Note
            that after submit, you cannot undo the assign of staffs due to our
            policy)(Staff that has been assigned already will not be effected)
            <br />
            <div className="grid grid-cols-2 gap-0">
              {assignList
                .filter(
                  (item: any) => item.isEnrolled == true && item.canUndo == true
                )
                .map((item: { id: any; username: any }, index: any) => {
                  return (
                    <div key={item.id}>
                      _{index + 1} {item.username}
                    </div>
                  );
                })}
            </div>
          </AlertDialogDescription>

          <AlertDialogCancel onClick={() => cancel()}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button className="Button red" onClick={() => onSubmit()}>
              Confirm {loading ? <Loader /> : <></>}
            </button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
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
                            className="h-6 w-6"
                            id={"department " + item.id}
                            onChange={(e) => onChangeDepartmentList(i)}
                            disabled={isEditing ? false : true}
                            value={item.title}
                            type="checkbox"
                            checked={item.isEnrolled}
                            defaultChecked={item.isEnrolled}
                          />{" "}
                          {item.title}
                        </>
                      }
                    >
                      <div
                        key={"department-user " + item.id}
                        className="grid grid-cols-2 gap-2 w-full"
                      >
                        {item.User.length == 0
                          ? "NO USER"
                          : item.User.map((item: any, j: any) => {
                              return (
                                <div
                                  key={item.id}
                                  className="flex items-center space-x-2 p-2 dark:text-slate-50 bg-white dark:bg-gray-800 rounded-lg shadow"
                                >
                                  <input
                                    id={"user " + item.id}
                                    onChange={(e) => onChangeStudentList(i, j)}
                                    disabled={isEditing ? false : true}
                                    value={item.title}
                                    type="checkbox"
                                    className="form-checkbox h-6 w-6 text-blue-600 dark:text-blue-400 "
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
              <Button onClick={() => onConfirm()}>Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
