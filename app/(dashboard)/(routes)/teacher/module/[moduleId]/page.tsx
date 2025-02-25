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

import { ModuleTitleForm } from "./_components/module-title-form";
// import { ChapterDescriptionForm } from "./_components/chapter-description-form";
// import { ChapterAccessForm } from "./_components/chapter-access-form";
// import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ModuleActions } from "./_components/module-actions";

// import Exam from "./_components/chapter-exam-form";
import { FileUpload } from "@/components/file-upload";
import { z } from "zod";
import Dropzone from "@/components/ui/dropzone";
import router from "next/dist/client/router";
import { ContentForm } from "./_components/module-content-form";
import { ModuleDepartment } from "./_components/module-department";
// import { AttacthmentForm } from "./_components/chapter-attachment-form";

const ModuleIdPage = async ({
  params,
}: {
  params: { moduleId: string };
}) => {
  const { userId } = auth();

  let contentType = "file";
  if (!userId) {
    return redirect("/");
  }
  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    url: z.string().min(1),
  });
  const module = await db.module.findUnique({
    where: {
      id: params.moduleId,
    },
    include: {
      Resource: true,
    },
  });

  if (!module) {
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
    module.title,
    // chapter.description,
    // chapter.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Sending the updated values to the backend API to update the module
      await fetch(`/api/resources/module/${params.moduleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Send the updated data
      });

      // Use router.replace() to reload the current page
      router.replace(router.asPath); // This will reload the current page and reflect the changes
    } catch (error) {
      console.error("Error updating module:", error);
      alert("Something went wrong while updating the module");
    }
  };


  return (
    <>
      {!module.isPublished && (
        <Banner
          variant="warning"
          label="This module is unpublished. It will not be visible in the course"
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/module`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to module setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Module Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ModuleActions
                disabled={!isComplete}
                moduleId={params.moduleId}
                isPublished={module.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your module</h2>
              </div>
              <ModuleTitleForm
                initialData={module}
                moduleId={params.moduleId}
              />
            </div>
            <ModuleDepartment
            moduleId={params.moduleId}
            initialDepartmentId={module.departmentId}
          />
          </div>
          
          {/* <AttacthmentForm
              initialData={chapter}
              moduleId={params.moduleId}
            ></AttacthmentForm> */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={BookOpen} />
              <h2 className="text-xl">Customize your content</h2>
            </div>
            <ContentForm
              moduleId={params.moduleId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ModuleIdPage;
