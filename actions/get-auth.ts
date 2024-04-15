import { auth } from "@clerk/nextjs";


export const getAuth = async (): Promise<any> => {
  try {
    const {userId} = auth()

    return userId;
  } catch (error) {
    console.log("[GET_AUTH]", error);
    return 0;
  }
};
