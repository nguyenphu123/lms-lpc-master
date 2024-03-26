"use client";

import Clerk from "@clerk/clerk-js";
import { UserButton } from "@clerk/nextjs";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
const LinkButton = async () => {
  const router = useRouter();
  const onLink = async () => {
    try {
      const userClerk = new Clerk(
        "pk_test_cG93ZXJmdWwtZm94LTEuY2xlcmsuYWNjb3VudHMuZGV2JA"
      );
      await userClerk.load();
      let user: any = await userClerk?.user?.createExternalAccount({
        strategy: "oauth_microsoft",
        redirect_url: "/pending",
        redirectUrl: "/pending",
      });
      router.push(user.verification.externalVerificationRedirectURL.href);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      Please link your account to your Lien Phat microsoft account here
      <button onClick={() => onLink()}>Link</button>
      {/* <UserButton
        afterSignOutUrl="/"
        defaultOpen={true}
        userProfileMode="modal"
      /> */}
    </>
  );
};

export default LinkButton;
