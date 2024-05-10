import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CourseNavbar } from "./_components/course-navbar";
import { Sidebar } from "./_components/sidebar";

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

  return (
    <div className="h-full">
      <div className="h-[80px] fixed inset-y-0 w-full z-50">
        <CourseNavbar userId={userId} />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar userId={userId} />
      </div>
      <main className="md:pl-56 pt-[80px] h-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default ProgramLayout;
