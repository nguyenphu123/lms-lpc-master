import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId, sessionClaims }: any = auth();

  if (sessionClaims.userInfo.role.toUpperCase() == "STAFF") {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
