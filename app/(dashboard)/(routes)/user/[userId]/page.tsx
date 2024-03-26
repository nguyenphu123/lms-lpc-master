import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import Avatar from "./_components/avatar";
import Star from "./_components/star";
import UserInformation from "./_components/infomation-form";
import CourseHistory from "./_components/courses-history";
import { string } from "zod";
interface userValue {
  userId: string;
  star: number;
  imageUrl: string;
  role: string;
  permissionRole: string;
}
const UserPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const user: userValue | any = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Department: true,
    },
  });
  return (
    user && (
      <div className="p-6">
        <Avatar imageUrl={user?.imageUrl} />
        <Star star={user?.star} />
        <UserInformation user={user} />
        <CourseHistory userId={params.userId} />
      </div>
    )
  );
};

export default UserPage;
