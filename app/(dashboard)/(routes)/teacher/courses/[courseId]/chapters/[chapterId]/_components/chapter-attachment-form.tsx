"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Link = dynamic(() => import("next/link"), { ssr: false });

interface AttachmentFormProps {
  initialData: any;
  courseId: string;
  moduleId: string;
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
}: AttachmentFormProps) => {
  const [edit, setEdit] = useState(false);
  const toggleEdit = () => setEdit((current) => !current);
  const [contents, setContents] = useState<
    Array<{
      moduleId: string;
      attachment: string;
      attachmentType: string;
    }>
  >(initialData.Resource);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onChangeFileUrl = async (e: any, index: any) => {
    e.preventDefault();
    setIsLoading(true);
    const file = e.target.files?.[0];

    let getToken = await axios.get("/api/getToken");
    // if (
    //   contents[objIndex].attachment != null &&
    //   contents[objIndex].attachment != ""
    // ) {
    //   await axios.delete(contents[objIndex].attachment, {
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       "X-Auth-Token": getToken.data["x-subject-token"],
    //     },
    //   });
    // }

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
    contents[index].attachmentType = "extra";
    contents[index].moduleId = moduleId;
    contents[
      index
    ].attachment = `${process.env.NEXT_PUBLIC_ACCOUNT_URL}/Course/${getCourse.data.title}/${getChapter.data.title}/${initialData.title}/attachment/${file.name}`;
    setContents([...contents]);
    setIsLoading(false);
  };

  const addResource = () => {
    let newItem = {
      attachment: "",
      attachmentType: "Extra",
      moduleId,
    };
    setContents([...contents, newItem]);
  };
  const onSubmit = async () => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${moduleId}/attachment`,
        contents
      );
      toast.success("Attachment created");
      let reloadData = await axios.get(
        `/api/courses/${courseId}/chapters/${moduleId}/attachment`
      );
      setContents(reloadData.data);
      // toggleEdit();
      // router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4 dark:text-white">
      <div className="font-medium flex items-center justify-between mb-4">
        <div className="flex items-center">Chapter Extra Resources</div>
      </div>

      <div className="space-y-4">
        {contents.map((item: any, index: any) => (
          <div
            key={item.attachment}
            className="flex items-center justify-between"
          >
            {item.attachment !== "" ? (
              <>
                <Link
                  suppressHydrationWarning={true}
                  download="Attachment"
                  href={item.attachment}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {item.attachment.split("/").pop() as string}
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    setContents(contents.filter((_, i) => i != index))
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded-md ml-2"
                >
                  Remove
                </button>
              </>
            ) : (
              <input
                type="file"
                onChange={(e: any) => onChangeFileUrl(e, index)}
                accept="application/*"
                className="file-input"
              />
            )}
          </div>
        ))}
      </div>
      {isLoading ? (
        <div className="flex justify-end space-x-4 mt-6">
          <button
            disabled
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Waiting...
          </button>
          <button
            disabled
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Waiting...
          </button>
        </div>
      ) : (
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={addResource}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Resource
          </button>
          <button
            onClick={onSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};
