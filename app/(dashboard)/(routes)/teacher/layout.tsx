import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId }: any = auth();
  let userInfo: any = await db.user.findUnique({
    where: { id: userId, status: "approved" },
  });

  

  return (
    <div className="overflow-x-hidden items-center justify-center">
      {children}
    </div>
  );
};

export default TeacherLayout;
