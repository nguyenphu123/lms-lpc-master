"use client";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Trash, PlusCircle, Asterisk } from "lucide-react";
import dynamic from "next/dynamic";

const Link = dynamic(() => import("next/link"), { ssr: false });

interface AttachmentFormProps {
  moduleId: string;
}

export const ContentForm = ({ moduleId }: AttachmentFormProps) => {
  const [contents, setContents] : any = useState<{
    fileUrl: string;
    description: string;
    id: string;
    title: string;
    moduleId: string;
    content: string;
    contentType: string;
    videoUrl: string;
    Resource: Array<any>;
  }>();

  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const addContent = () => {
  //   const newContent = {
  //     id: generateId(),
  //     title: "New page",
  //     moduleId,
  //     description: "",
  //     content: "",
  //     contentType: "video",
  //     videoUrl: "",
  //     fileUrl: "",
  //     Resource: [],
  //   };
  // };

  const removeContent = (id: string) => {
    setContents(contents.filter((content: { id: string; }) => content.id !== id));
  };
  debugger
  useEffect(() => {
    const loadData = async () => {
      
      const { data } = await axios.get(`/api/resources/module/${moduleId}`);
      setContents(data);
    };
    loadData();
  }, [moduleId]);

  const router = useRouter();

  const onSubmit = async () => {
    try {
      await axios.patch(`/api/resources/module/${moduleId}`, {
        contents,
      });
      toast.success("Content created");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleChange = (field: string, value: string, id: string) => {
    setContents(
      contents.map((content: { id: string; }) =>
        content.id === id ? { ...content, [field]: value } : content
      )
    );
  };

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    id: string,
    field: "fileUrl" | "videoUrl"
  ) => {
    setIsLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const getToken = await axios.get("/api/getToken");
      const { data: getChapter } = await axios.get(
        `/api/resources/module/${moduleId}`
      );

      const uploadUrl = `${process.env.NEXT_PUBLIC_ACCOUNT_URL}/Module/${getChapter.title}/${file.name}`;

      await axios.put(uploadUrl, file, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": file.type,
          "X-Auth-Token": getToken.data["x-subject-token"],
        },
      });

      handleChange(field, uploadUrl, id);
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mt-6 border dark:text-white rounded-md p-4">
      <div className="font-medium flex items-center justify-between mb-4">
        <div className="flex items-center">
          Module Content <Asterisk className="size-4" color="red" />
        </div>
      </div>
      <div key={contents?.id} className="mb-4">
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={contents?.title}
            onChange={(e) => handleChange("title", e.target.value, contents.id)}
            className="border p-2 rounded-md w-full"
          />
          <select
            value={contents?.contentType}
            onChange={(e) =>
              handleChange("contentType", e.target.value, contents.id)
            }
            className="border p-2 rounded-md ml-2"
          >
            <option value="video">Video</option>
            <option value="file">File</option>
            <option value="text">Text</option>
          </select>
          <button
            onClick={() => removeContent(contents.id)}
            className="bg-red-600 text-white px-3 py-2 rounded-md ml-2"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div> 

        {contents?.contentType === "video" ? (
          <div className="mb-4">
            <div className="font-medium mb-2">
              {contents.videoUrl ? "Update Video" : "Add a Video"}
            </div>
            <div className="mb-2">
              {contents.videoUrl && !edit ? (
                <Link
                  href={contents.videoUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {contents.videoUrl.split("/").pop()}
                </Link>
              ) : (
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, contents.id, "videoUrl")}
                  accept="video/*"
                  className="file-input"
                />
              )}
              {contents.videoUrl && (
                <button
                  type="button"
                  onClick={() => setEdit(!edit)}
                  className="ml-2"
                >
                  {edit ? "Cancel" : "Edit"}
                </button>
              )}
            </div>
            <textarea
              value={contents.description}
              onChange={(e) =>
                handleChange("description", e.target.value, contents.id)
              }
              className="border p-2 rounded-md w-full"
              placeholder="Description"
            ></textarea>
          </div>
        ) : contents?.contentType === "text" ? (
          <div className="mb-4">
            <Editor
              apiKey="8jo1uligpkc7y1v598qze63nfgfvcflmy7ifyfqt9ah17l7m"
              value={contents.content}
              onEditorChange={(content) =>
                handleChange("content", content, contents.id)
              }
              init={{
                height: 500,
                width: "auto",
                plugins: [
                  "advlist autolink lists link image charmap preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table code help wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                paste_data_images: true,
              }}
            />
            <textarea
              value={contents.description}
              onChange={(e) =>
                handleChange("description", e.target.value, contents.id)
              }
              className="border p-2 rounded-md w-full mt-4"
              placeholder="Description"
            ></textarea>
          </div>
        ) : (
          <div className="mb-4">
            <div className="font-medium mb-2">
              {contents?.fileUrl ? "Update File" : "Add a File"}
            </div>
            <div className="mb-2">
              {contents?.fileUrl && !edit ? (
                <Link
                  href={contents.fileUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {contents.fileUrl.split("/").pop()}
                </Link>
              ) : (
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, contents.id, "fileUrl")}
                  accept="application/*"
                  className="file-input"
                />
              )}
              {contents?.fileUrl && (
                <button
                  type="button"
                  onClick={() => setEdit(!edit)}
                  className="ml-2"
                >
                  {edit ? "Cancel" : "Edit"}
                </button>
              )}
            </div>
            <textarea
              value={contents?.description}
              onChange={(e) =>
                handleChange("description", e.target.value, contents.id)
              }
              className="border p-2 rounded-md w-full"
              placeholder="Description"
            ></textarea>
          </div>
        )}
        <div className="flex justify-end">
          {isLoading ? (
            <button
              disabled
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Waiting...
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
