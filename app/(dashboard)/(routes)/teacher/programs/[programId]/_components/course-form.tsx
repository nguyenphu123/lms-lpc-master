"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CourseForm = (
  { programId }: any,
  { params }: { params: { programId: string } }
) => {
  const [programOwnCourses, setProgramOwnCourses]: any = useState([]);
  const [availableCourses, setAvailableCourses]: any = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsUpdating((current) => !current);
  };
  useEffect(() => {
    async function loadProgramOwnCourses() {
      let programOwnCourses = await axios.get(
        `/api/programs/${programId}/courses`
      );

      setProgramOwnCourses(programOwnCourses.data);
    }
    async function loadAvailibleCourses() {
      let availibleCourses = await axios.get(`/api/courses/available`);
      setAvailableCourses(availibleCourses.data);
    }

    loadProgramOwnCourses();
    loadAvailibleCourses();
  });
  const router = useRouter();
  async function addToProgram(item: any) {
    let newItem = { ...item };

    newItem["programId"] = programId;
    axios.patch(`/api/programs/${programId}/courses`, newItem);
    toast.success("Added");
    toggleCreating();
    router.refresh();
    let programOwnCourses = await axios.get(
      `/api/programs/${programId}/courses`
    );
    setProgramOwnCourses(programOwnCourses.data);
    let availibleCourses = await axios.get(`/api/courses/available`);
    setAvailableCourses(availibleCourses.data);
  }
  async function removeFromProgram(item: any) {
    let newItem = { ...item };

    newItem["programId"] = programId;
    axios.patch(`/api/programs/${programId}/courses`, newItem);
    toast.success("Removed");
    toggleCreating();
    router.refresh();
    let programOwnCourses = await axios.get(
      `/api/programs/${programId}/courses`
    );
    setProgramOwnCourses(programOwnCourses.data);
    let availibleCourses = await axios.get(`/api/courses/available`);
    setAvailableCourses(availibleCourses.data);
  }
  //   console.log(programOwnCourses);
  //   console.log(availibleCourses);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 grid grid-cols-2 gap-4 text-black dark:bg-slate-950">
      <div>
        <div className="font-medium flex items-center justify-between dark:text-slate-50">
          Courses
        </div>
      </div>
      {availableCourses.length == 0 ? (
        <div className="dark:text-slate-50">
          No courses available for this program
        </div>
      ) : (
        <div className="grid grid-cols-1 dark:text-slate-50">
          {availableCourses.map((item: any, index: any) => (
            <AlertDialog key={item.id}>
              <AlertDialogTrigger>
                <div key={item.id} className="mb-2">
                  {item.title}
                </div>
              </AlertDialogTrigger>

              <AlertDialogContent className="AlertDialogContent">
                <AlertDialogTitle className="AlertDialogTitle">
                  Add this course to this program?
                </AlertDialogTitle>
                <AlertDialogDescription className="AlertDialogDescription">
                  After this {item.title} will belong to this program.
                </AlertDialogDescription>
                <div
                  style={{
                    display: "flex",
                    gap: 25,
                    justifyContent: "flex-end",
                  }}
                >
                  <AlertDialogCancel asChild>
                    <button className="Button mauve">Cancel</button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <button
                      className="Button red"
                      onClick={() => addToProgram(item)}
                    >
                      Yes
                    </button>
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>
      )}
      <div className="border-t border-gray-300 col-span-2"></div>
      <div>
        <div className="font-medium flex items-center justify-between">
          Program
        </div>
      </div>
      {programOwnCourses.length == 0 ? (
        <div className="dark:text-slate-50">
          No courses available in this program
        </div>
      ) : (
        <div className="grid grid-cols-1 dark:text-slate-50">
          {programOwnCourses.map((item: any, index: any) => (
            <AlertDialog key={item.id}>
              <AlertDialogTrigger>
                <div key={item.id} className="mb-2">
                  {item.title}
                </div>
              </AlertDialogTrigger>

              <AlertDialogContent className="AlertDialogContent">
                <AlertDialogTitle className="AlertDialogTitle">
                  Remove this course to this program?
                </AlertDialogTitle>
                <AlertDialogDescription className="AlertDialogDescription">
                  After this {item.title} will no longer belong to this program.
                </AlertDialogDescription>
                <div
                  style={{
                    display: "flex",
                    gap: 25,
                    justifyContent: "flex-end",
                  }}
                >
                  <AlertDialogCancel asChild>
                    <button className="Button mauve">Cancel</button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <button
                      className="Button red"
                      onClick={() => removeFromProgram(item)}
                    >
                      Yes
                    </button>
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>
      )}
    </div>
  );
};
export default CourseForm;
