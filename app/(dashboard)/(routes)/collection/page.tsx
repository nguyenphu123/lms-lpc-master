import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

const UserCollection = async () => {
  const { sessionClaims }: any = auth();

  if (!sessionClaims.userId) {
    return redirect("/");
  }

  const users: any = await db.user.findUnique({
    where: { id: sessionClaims.userId },
    include: {
      ClassSessionRecord: {
        where: { status: "finished" },
        include: {
          course: true,
        },
      },
    },
  });

  return <div className="p-6">Under maintainence</div>;
};

export default UserCollection;
