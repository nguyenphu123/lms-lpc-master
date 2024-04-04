"use client";

import * as z from "zod";
import axios from "axios";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Resource } from "@prisma/client";
import Link from "next/link";

interface AttachmentFormProps {
  initialData: any;
  courseId: string;
  moduleId: string;
  slideId: string;
}

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const AttacthmentForm = ({
  initialData,
  courseId,
  moduleId,
  slideId,
}: AttachmentFormProps) => {
  const [edit, setEdit] = useState(false);
  const toggleEdit = () => setEdit((current) => !current);
  const [contents, setContents] = useState<
    Array<{
      slideId: string;
      attachment: string;
      attachmentType: string;
    }>
  >(initialData.Resource);
  const router = useRouter();
  const onChangeFileUrl = async (e: any, id: any) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    let objIndex = contents.findIndex((obj: any, index: any) => obj.id == id);

    let getToken = await axios.get("/api/getToken");
    if (
      contents[objIndex].attachment != null &&
      contents[objIndex].attachment != ""
    ) {
      await axios.delete(contents[objIndex].attachment, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "X-Auth-Token": getToken.data["x-subject-token"],
        },
      });
    }

    let getCourse: any = await axios.get(`/api/courses/${courseId}`);
    let getChapter: any = await axios.get(
      `/api/courses/${courseId}/chapters/${moduleId}`
    );

    await axios.put(
      `${process.env.NEXT_PUBLIC_ACCOUNT_URL}/Course/${getCourse.data.title}/${getChapter.data.title}/${initialData.title}/attachment/${file.name}`,
      file,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Accept: "*/*",
          "Content-Type": file.type,
          "X-Auth-Token": getToken.data["x-subject-token"],
        },
      }
    );
    contents[objIndex].attachmentType = "extra";
    contents[
      objIndex
    ].attachment = `${process.env.NEXT_PUBLIC_ACCOUNT_URL}/Course/${getCourse.data.title}/${getChapter.data.title}/${initialData.title}/attachment/${file.name}`;
    setContents([...contents]);
  };
  const addResource = () => {
    let newItem = {
      slideId: slideId,
      attachment: "",
      attachmentType: "Extra",
    };
    setContents([...contents, newItem]);
  };
  const onSubmit = async () => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${moduleId}/slide/${slideId}/attachment`,
        contents
      );
      toast.success("Attachment created");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4 dark:text-white">
      <div className="font-medium flex items-center justify-between">
        Chapter Extra resources
      </div>

      <div>
        {contents.map((item: any) => (
          <>
            {item.attachment != "" && !edit ? (
              <Link
                suppressHydrationWarning={true}
                download="Exam_Format"
                href={item.attachment}
                target="_blank"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                {item.attachment.split("/").pop() as string}
              </Link>
            ) : (
              <input
                type="file"
                onChange={(e: any) => onChangeFileUrl(e, item.id)}
                accept="application/*"
              />
            )}
            {item.attachment !== "" ? (
              !edit ? (
                <button type="button" onClick={() => setEdit(!edit)}>
                  edit
                </button>
              ) : (
                <button type="button" onClick={() => setEdit(!edit)}>
                  cancel
                </button>
              )
            ) : (
              <></>
            )}
          </>
        ))}
      </div>
      <div className="flex items-center justify-between">
        {/* <div className="font-medium">Course content</div> */}
        <button
          onClick={() => addResource()}
          className="bg-black text-white px-4 py-2 rounded-md ml-auto"
        >
          Add
        </button>
      </div>
      <div className="flex items-center justify-between">
        {/* <div className="font-medium">Course content</div> */}
        <button
          onClick={() => onSubmit()}
          className="bg-black text-white px-4 py-2 rounded-md ml-auto"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
