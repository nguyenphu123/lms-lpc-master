import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
  SquareDashedBottomCode,
  UserPlus,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";

// import { PriceForm } from "./_components/price-form";
// import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Actions } from "./_components/actions";
import { Prisma } from "@prisma/client";
import { CreditForm } from "./_components/credit-form";
import { DepartmentForm } from "./_components/department-form";
import { StudentAssignForm } from "./_components/student-assign";
const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course: any = await db.course.findUnique({
    where: {
      id: params.courseId,
      // userId,
    },
    include: {
      Module: {
        orderBy: {
          position: "asc",
        },
      },
      ClassSessionRecord: {},
      CourseOnDepartment: {
        include: {
          Department: true,
        },
      },
      // attachments: {
      //   orderBy: {
      //     createdAt: "desc",
      //   },
      // },
    },
  });
  const department: any = await db.department.findMany({});
  const users: any = await db.user.findMany({
    where: {
      id: { not: userId },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    // course.description,
    course.imageUrl,
    course.credit,
    // course.price,
    // course.programId,
    course.Module.some((chapter: { isPublished: any }) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <Link
              href={`/teacher/courses`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course
            </Link>
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            title={course.title}
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <CreditForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={SquareDashedBottomCode} />
                <h2 className="text-xl">Department</h2>
              </div>
              <DepartmentForm
                initialData={course}
                courseId={course.id}
                department={department}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={UserPlus} />
                <h2 className="text-xl">Assign staff</h2>
              </div>
              <StudentAssignForm
                initialData={course}
                courseId={course.id}
                Student={users}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
