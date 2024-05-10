import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutDashboard, ListChecks } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";

import { TitleForm } from "./_components/title-form";
import { PermissionForm } from "./_components/permission-list";

const RoleIdPage = async ({ params }: { params: { roleId: string } }) => {
  const { userId } = auth();

  if (!userId) {
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
      .indexOf("Edit role permission") == -1
  ) {
    return redirect("/");
  }
  // try {
  const role: any = await db.role.findUnique({
    where: {
      id: params.roleId,
      // userId,
    },

    include: {
      rolePermission: {
        include: {
          permission: true,
        },
      },
    },
  });
  const permissions = await db.permission.findMany({
    where: {
      status: "active",
    },
  });
  if (!role) {
    return redirect("/");
  }

  const requiredFields = [
    role.title,

    // program.startDate,
    // Add more fields as needed for your program
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <Link
              href={`/teacher/roles`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to role
            </Link>
            <h1 className="text-2xl font-medium">Role setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your role</h2>
            </div>
            <TitleForm initialData={role} roleId={role.id} />
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Role permissions</h2>
              <PermissionForm
                initialData={role}
                roleId={role.id}
                permission={permissions}
              ></PermissionForm>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleIdPage;
