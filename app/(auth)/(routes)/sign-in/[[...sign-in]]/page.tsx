"use client";
import { useSignIn } from "@clerk/clerk-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmailCodeFactor, SignInFirstFactor } from "@clerk/types";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ModeToggle } from "@/components/ui/theme-button";
const Logo = dynamic(() => import("@/app/(auth)/_component/logo" as string), {
  ssr: false,
});

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    if (!emailAddress.includes("@lp.com.vn")) {
      return;
    }

    let user = await axios.post("/api/checkLDAP", {
      emailAddress,
      // password,
      // department,
    });

    if (!user.data) {
      return;
    }
    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: emailAddress,
      });

      const isEmailCodeFactor = (
        factor: SignInFirstFactor
      ): factor is EmailCodeFactor => {
        return factor.strategy === "email_code";
      };
      const emailCodeFactor = supportedFirstFactors?.find(isEmailCodeFactor);

      if (emailCodeFactor) {
        // Grab the phoneNumberId
        const { emailAddressId }: any = emailCodeFactor;

        // Send the OTP code to the user
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId,
        });

        // Set 'verifying' true to display second form and capture the OTP code
        setPendingVerification(true);
      }
    } catch (err: any) {
      console.error("error", err.errors[0].longMessage);
    }
  };
  const onPressVerify = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setTimeout(function () {
          // function code goes here
        }, 2000);
        router.push("/");
      } else {
        /*Investigate why the sign-in hasn't completed */
        console.log(result);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <div className="max-w-md mx-auto border mt-24 border-gray-300 p-6 rounded-lg">
      <div className="relative">
        <div className="absolute mt-1 top-0 right-0">
          <ModeToggle />
        </div>
      </div>
      <div className="mb-4 flex justify-center">
        <Logo />
      </div>
      <h1 className="text-2xl font-semibold mb-4">Lien Phat Learning System</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            onChange={(e) => setEmailAddress(e.target.value)}
            id="email"
            name="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Sign In
        </button>
        <Link href={"/sign-up"}>
          <button className="w-full bg-gray-300 mt-1 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300">
            Switch Sign Up
          </button>
        </Link>
      </form>
      {/* Xác minh mã nếu cần */}
      {/* Hiển thị phần xác minh mã nếu pendingVerification là true */}
      {pendingVerification && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-zinc-950">
            <h2 className="text-xl font-bold mb-4 text-center">Verify Email</h2>
            <form className="flex flex-col space-y-4">
              <div>
                <label htmlFor="code">Code</label>
                <input
                  onChange={(e) => setCode(e.target.value)}
                  id="code"
                  name="code"
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                />
              </div>
              <button
                onClick={onPressVerify}
                className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Verify
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
