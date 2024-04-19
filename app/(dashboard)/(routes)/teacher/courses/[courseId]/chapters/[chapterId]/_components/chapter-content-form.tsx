"use client";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import Dropzone from "@/components/ui/dropzone";
import { Video, Trash, PlusCircle } from "lucide-react";
import Link from "next/link";
import { AttacthmentForm } from "./chapter-attachment-form";

interface AttachmentFormProps {
  courseId: string;
  moduleId: string;
}

export const ContentForm = ({ courseId, moduleId }: AttachmentFormProps) => {
  const [contents, setContents] = useState<
    Array<{
      fileUrl: string;
      description: string;
      id: string;
      title: string;
      moduleId: string;
      content: string;
      contentType: string;
      videoUrl: string;
      Resource: Array<any>;
    }>
  >([]);
  const [currentTab, setCurrentTab] = useState("");
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  const addContent = () => {
    let initContent = {
      id: getRandomInt(100000).toString(),
      title: "New page",
      moduleId: moduleId,
      description: "",
      content: "",
      contentType: "video",
      videoUrl: "",
      fileUrl: "",
      Resource: [],
    };
    setCurrentTab(initContent.id);
    setContents([...contents, initContent]);
  };
  const removeContent = (id: any) => {
    let objIndex = contents.findIndex((obj: any, index: any) => obj.id == id);
    let newArr = [...contents];
    newArr.splice(objIndex, 1);
    setContents([...newArr]);
  };
  useEffect(() => {
    async function loadData() {
      let contentList = await axios.get(
        `/api/courses/${courseId}/chapters/${moduleId}/slide`
      );
      // console.log(questionList.data);
      if (contentList.data.length == 0) {
      } else {
        setCurrentTab(contentList.data[0].id);
        setContents(contentList.data);
      }

      // if (data.data.type.toLowerCase() == "video") {
      //   setSelectedFile(data.data.content);
      // } else {
      //   editorRef = data.data.content;
      // }
    }
    loadData();
  }, []);
  const router = useRouter();

  const onSubmit = async () => {
    let values = {
      contents,
    };
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${moduleId}/slide`,
        values
      );
      toast.success("Content created");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onChangeType = (e: ChangeEvent<HTMLSelectElement>, id: any) => {
    e.preventDefault();
    let objIndex = contents.findIndex((obj: any, index: any) => obj.id == id);

    contents[objIndex].contentType = e.target.value;
    setContents([...contents]);
  };
  const onChangeContent = (content: string, id: any) => {
    let objIndex = contents.findIndex((obj: any, index: any) => obj.id == id);
    contents[objIndex].content = content;
    setContents([...contents]);
  };
  const onChangeTitle = (e: ChangeEvent<HTMLSelectElement>, id: any) => {
    e.preventDefault();
    let objIndex = contents.findIndex((obj: any, index: any) => obj.id == id);
    contents[objIndex].title = e.target.value;
    setContents([...contents]);
  };
  const onChangeDescription = (e: ChangeEvent<HTMLSelectElement>, id: any) => {
    e.preventDefault();
    let objIndex = contents.findIndex((obj: any, index: any) => obj.id == id);
    contents[objIndex].description = e.target.value;
    setContents([...contents]);
  };

  const onChangeFileUrl = async (e: any, id: any) => {
    e.preventDefault();
    setIsLoading(true);
    const file = e.target.files?.[0];
    let objIndex = contents.findIndex((obj: any, index: any) => obj.id == id);

    let getToken = await axios.get("/api/getToken");
    if (
      contents[objIndex].fileUrl != null &&
      contents[objIndex].fileUrl != ""
    ) {
      await axios.delete(contents[objIndex].fileUrl, {
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
      `${process.env.NEXT_PUBLIC_ACCOUNT_URL}/Course/${getCourse.data.title}/${getChapter.data.title}/${file.name}`,
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
    contents[
      objIndex
    ].fileUrl = `${process.env.NEXT_PUBLIC_ACCOUNT_URL}/Course/${getCourse.data.title}/${getChapter.data.title}/${file.name}`;
    setContents([...contents]);
    setIsLoading(false);
  };
  const onChangeVideoUrl = async (e: any, id: any) => {
    e.preventDefault();
    setIsLoading(true);
    const file = e.target.files?.[0];
    let objIndex = contents.findIndex((obj: any, index: any) => obj.id == id);
    let getToken = await axios.get("/api/getToken");
    if (
      contents[objIndex].videoUrl != null &&
      contents[objIndex].videoUrl != ""
    ) {
      await axios.delete(contents[objIndex].videoUrl, {
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
      `${process.env.NEXT_PUBLIC_ACCOUNT_URL}/Course/${getCourse.data.title}/${getChapter.data.title}/${file.name}`,
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
    contents[
      objIndex
    ].videoUrl = `${process.env.NEXT_PUBLIC_ACCOUNT_URL}/Course/${getCourse.data.title}/${getChapter.data.title}/${file.name}`;
    setContents([...contents]);
    setIsLoading(false);
  };
  return (
    <div className="mt-6 border dark:text-white rounded-md p-4">
      <div className="font-medium flex items-center justify-between mb-4">
        Course Content
      </div>
      <button
        onClick={() => addContent()}
        className="bg-black text-white px-4 py-2 rounded-md mb-4 flex items-center"
      >
        <PlusCircle className="h-4 w-4 mr-2" /> Content
      </button>
      {contents.map((item: any) => (
        <div
          key={item.id}
          onClick={() => setCurrentTab(item.id)}
          className={`cursor-pointer mb-4 p-2 rounded-md ${
            currentTab === item.id ? "bg-gray-200 dark:bg-lime-900" : ""
          }`}
        >
          {item.title}
        </div>
      ))}
      {contents
        .filter((item: any) => item.id === currentTab)
        .map((item: any) => (
          <div key={item.id} className="mb-4">
            <div className="mb-4 flex items-center">
              <input
                type="text"
                defaultValue={item.title}
                onChange={(e: any) => onChangeTitle(e, item.id)}
                className="border p-2 rounded-md w-full"
              />
              <select
                name="contentType"
                defaultValue={item.contentType}
                onChange={(e) => onChangeType(e, item.id)}
                className="border p-2 rounded-md ml-2"
              >
                <option value="video">Video</option>
                <option value="file">File</option>
                <option value="text">Text</option>
              </select>
              <button
                onClick={() => removeContent(item.id)}
                className="bg-black text-white px-3 py-3 rounded-md ml-2"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>

            {item.contentType?.toLowerCase() === "video" ? (
              <div className="mb-4">
                <div className="font-medium flex items-center justify-between mb-4">
                  {/* Add Video Icon */}
                  {item.videoUrl === "" ? "Add a video" : "Update video"}
                </div>
                <div className="mb-2">
                  {item.videoUrl != "" && !edit ? (
                    <Link
                      suppressHydrationWarning={true}
                      href={item.videoUrl}
                      target="_blank"
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      {item.videoUrl.split("/").pop() as string}
                    </Link>
                  ) : (
                    <input
                      type="file"
                      onChange={(e: any) => onChangeVideoUrl(e, item.id)}
                      accept="application/*"
                    />
                  )}
                  {item.videoUrl !== "" ? (
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
                </div>
                <div className="font-medium flex items-center justify-between mb-4">
                  Description
                </div>
                <textarea
                  value={item.description}
                  onChange={(e: any) => onChangeDescription(e, item.id)}
                  className="border p-2 rounded-md w-full"
                ></textarea>
              </div>
            ) : item.contentType?.toLowerCase() === "text" ? (
              <div className="mb-4">
                <div className="font-medium flex items-center justify-between mb-4">
                  Description
                </div>
                <Editor
                  apiKey="8jo1uligpkc7y1v598qze63nfgfvcflmy7ifyfqt9ah17l7m"
                  value={item.content}
                  onEditorChange={(content: any) =>
                    onChangeContent(content, item.id)
                  }
                  init={{
                    height: 500,
                    width: "auto",
                    // ... (unchanged options)
                  }}
                />
                {/* <div className="mb-2">
                  Description :{" "}
                  <textarea
                    value={item.description}
                    onChange={(e: any) => onChangeDescription(e, item.id)}
                    className="border p-2 rounded-md w-full"
                  ></textarea>
                </div> */}
              </div>
            ) : (
              <div>
                <div className="mb-2">
                  {/* Adjust input/file styling as needed */}
                  {item.fileUrl != "" && !edit ? (
                    <Link
                      suppressHydrationWarning={true}
                      download="Exam_Format"
                      href={item.fileUrl}
                      target="_blank"
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      {item.fileUrl.split("/").pop() as string}
                    </Link>
                  ) : (
                    <input
                      type="file"
                      onChange={(e: any) => onChangeFileUrl(e, item.id)}
                      accept="application/*"
                    />
                  )}
                  {item.fileUrl !== "" ? (
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
                </div>
                <div className="font-medium flex items-center justify-between mb-4">
                  Description
                </div>
                <div className="mb-2">
                  <textarea
                    value={item.description}
                    onChange={(e: any) => onChangeDescription(e, item.id)}
                    className="border p-2 rounded-md w-full"
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        ))}
      {contents.length > 0 && (
        <div className="flex items-center justify-between">
          {/* <div className="font-medium">Course content</div> */}
          {isLoading ? (
            <button
              disabled
              className="bg-black text-white px-4 py-2 rounded-md ml-auto"
            >
              Waiting...
            </button>
          ) : (
            <button
              onClick={() => onSubmit()}
              className="bg-black text-white px-4 py-2 rounded-md ml-auto"
            >
              Submit
            </button>
          )}
        </div>
      )}
    </div>
  );
};
