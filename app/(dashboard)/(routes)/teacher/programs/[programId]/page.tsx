import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
// import { CategoryForm } from "./_components/category-form";
// import { ChaptersForm } from "./_components/chapters-form";
import { Actions } from "./_components/actions";
import { Prisma } from "@prisma/client";
import CourseForm from "./_components/course-form";
import { DepartmentForm } from "./_components/department-form";

const ProgramIdPage = async ({ params }: { params: { programId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const department: any = await db.department.findMany({});
  // try {
  const program: any = await db.program.findUnique({
    where: {
      id: params.programId,
      // userId,
    },
    include: {
      courseWithProgram: {},
      ProgramOnDepartment: {},
    },
  });

  const courses = await db.program.findMany({
    orderBy: {
      title: "asc",
    },
  });

  if (!program) {
    return redirect("/");
  }

  const requiredFields = [
    program.title,
    program.imageUrl,
    // program.startDate,
    // Add more fields as needed for your program
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!program.isPublished && (
        <Banner label="This program is unpublished. It will not be visible to the students." />
      )}{" "}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <Link
              href={`/teacher/programs`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to program
            </Link>
            <h1 className="text-2xl font-medium">Program setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            programId={params.programId}
            isPublished={program.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your program</h2>
            </div>
            <TitleForm initialData={program} programId={program.id} />
            <DescriptionForm initialData={program} programId={program.id} />
            <ImageForm initialData={program} programId={program.id} />
            {/* <CategoryForm
                initialData={program}
                programId={program.id}
                options={categories.map((category) => ({
                  label: category.title,
                  value: category.id,
                }))}
              /> */}
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Program courses</h2>
              </div>
              <CourseForm programId={program.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <DepartmentForm
                initialData={program}
                programId={program.id}
                department={department}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
  // } catch (error) {
  //   console.error("Error fetching program:", error);
  //   return redirect("/");
  // }
};

export default ProgramIdPage;
