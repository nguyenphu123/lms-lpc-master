import { useAuth, useUser } from "@clerk/nextjs";

export const getAuth = () => {
  try {
    const { user }: any = useUser();
    console.log(user);
    return user;
  } catch (error) {
    console.log("[GET_AUTH]", error);
    return 0;
  }
};
