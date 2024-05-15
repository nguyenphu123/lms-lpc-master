import { auth } from "@clerk/nextjs";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId }: any = auth();
  let userInfo: any = await db.user.findUnique({
    where: { id: userId },
  });
  if (!userId) {
    return redirect("/");
  }
  return userInfo.isInExam ? (
    <>Sorry you are currently doing test!!!</>
  ) : (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar userId={userId} />
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

export default DashboardLayout;
