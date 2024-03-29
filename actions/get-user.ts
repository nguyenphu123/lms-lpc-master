import { db } from "@/lib/db";

export const getUser = async (): Promise<any> => {
  try {
    const users: any = await db.user.findMany({
      include: {
        Department: true,
      },
    });
    for (let i = 0; i < users.length; i++) {
      users[i]["department"] = users[i]["Department"]["title"];
    }

    return users;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
