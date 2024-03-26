import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
  const { sessionClaims }: any = auth();

  if (!sessionClaims.userId) {
    return redirect("/");
  }

  const user: userValue | any = await db.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      Department: true,
    },
  });
  return (
    user && (
      <div className="p-5">
        <Link
          href={`/teacher/users`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to users list
        </Link>
        <div className="text-center mb-4">
          <Avatar imageUrl={user?.imageUrl} />
          <p className="mt-2 text-lg font-semibold">
            Information about {user?.username}
          </p>
        </div>
        {/* <Star star={user?.star} /> */}
        <UserInformation user={user} />
        <CourseHistory userId={params.userId} />
      </div>
    )
  );
};

export default UserPage;
