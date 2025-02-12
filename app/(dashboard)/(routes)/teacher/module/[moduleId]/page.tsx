import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  LayoutDashboard,
  Video,
  File,
  BookOpen,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { ChapterTitleForm } from "./_components/chapter-title-form";
// import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ChapterActions } from "./_components/chapter-actions";

import Exam from "./_components/chapter-exam-form";
import { FileUpload } from "@/components/file-upload";
import { z } from "zod";
import Dropzone from "@/components/ui/dropzone";
import router from "next/dist/client/router";
import { ContentForm } from "./_components/chapter-content-form";
import { AttacthmentForm } from "./_components/chapter-attachment-form";

const ModuleIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  let contentType = "file";
  if (!userId) {
    return redirect("/");
  }
  const formSchema = z.object({
    url: z.string().min(1),
  });
  const chapter = await db.module.findUnique({
    where: {
      id: params.chapterId,
    },
    include: {      
      Resource: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }
  const checkUser = await db.userPermission.findMany({
    where: {
      userId: userId,
    },
    include: {
      permission: true,
    },
  });
  if (
    checkUser
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Edit course permission") == -1
  ) {
    return redirect("/");
  }
  const requiredFields = [
    chapter.title,
    // chapter.description,
    // chapter.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // try {
    //   await axios.post(`/api/courses/${courseId}/attachments`, values);
    //   toast.success("Course updated");
    //   toggleEdit();
    //   router.refresh();
    // } catch {
    //   toast.error("Something went wrong");
    // }
  };

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/module/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={LayoutDashboard} />
                  <h2 className="text-xl">Customize your chapter</h2>
                </div>
                <ChapterTitleForm
                  initialData={chapter}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                />
              </div>
            </div>
            <AttacthmentForm
              initialData={chapter}
              courseId={params.courseId}
              moduleId={params.chapterId}
            ></AttacthmentForm>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={BookOpen} />
                <h2 className="text-xl">Customize your content</h2>
              </div>
              <ContentForm
                courseId={params.courseId}
                moduleId={params.chapterId}
              />
            </div>
          </div>
      </div>
    </>
  );
};

export default ModuleIdPage;
