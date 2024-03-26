"use client";

import Clerk from "@clerk/clerk-js";
import { UserButton } from "@clerk/nextjs";
const LinkButton = async () => {
  // const onLink = async () => {
  //   try {
  //     const userClerk = new Clerk(
  //       "pk_test_cG93ZXJmdWwtZm94LTEuY2xlcmsuYWNjb3VudHMuZGV2JA"
  //     );
  //     await userClerk.load();
  //     let user = await userClerk?.user?.createExternalAccount({
  //       strategy: "oauth_microsoft",
  //       redirect_url: "/pending",
  //       redirectUrl: "/pending",
  //     });
  //     console.log(user);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <>
      Please link your account to your Lien Phat microsoft account here
      <UserButton
        afterSignOutUrl="/"
        defaultOpen={true}
        userProfileMode="modal"
      />
    </>
  );
};

export default LinkButton;
