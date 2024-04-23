import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CourseNavbar } from "./_components/course-navbar";

const ProgramLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { programId: string };
}) => {
  const { userId, sessionClaims }: any = auth();
  let userInfo: any = await db.user.findUnique({
    where: { id: userId, status: "approved" },
  });
  if (!userId) {
    return redirect("/");
  }
  if (userInfo.role.toUpperCase() == "STAFF") {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="h-[80px] fixed inset-y-0 w-full z-50">
        <CourseNavbar userId={userId} />
      </div>

      <main className="md:pl-20 pr-20 pt-[80px] h-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default ProgramLayout;
