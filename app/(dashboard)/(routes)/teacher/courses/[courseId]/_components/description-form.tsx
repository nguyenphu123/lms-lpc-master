"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@tinymce/tinymce-react";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

export const DescriptionForm = ({
  initialData,
  courseId,
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialData?.description || "");
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async () => {
    try {
      let values = {
        description: content,
      };
      await axios.patch(`/api/courses/${courseId}`, values);
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
        Course description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "dark:text-slate-50",
            "text-sm mt-2",
            !content && "text-slate-500 italic"
          )}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      )}
      {isEditing && (
        <>
          <Editor
            apiKey="8jo1uligpkc7y1v598qze63nfgfvcflmy7ifyfqt9ah17l7m"
            value={content}
            onEditorChange={(content: any) => setContent(content)}
            init={{
              height: 500,
              width: "auto",
              // ... (unchanged options)
            }}
          />
          <button
            onClick={() => onSubmit()}
            className="bg-black text-white px-4 py-2 rounded-md ml-auto"
          >
            Submit
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-black text-white px-4 py-2 rounded-md ml-auto"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};
