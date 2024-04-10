"use client";
import { useSignIn } from "@clerk/clerk-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmailCodeFactor, SignInFirstFactor } from "@clerk/types";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ModeToggle } from "@/components/ui/theme-button";
import { animatePageIn } from "@/app/utils/animations";
const Logo = dynamic(() => import("@/app/(auth)/_component/logo" as string), {
  ssr: false,
});
var CryptoJS = require("crypto-js");
export default function Page() {
  const [error, setError] = useState("");
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();
  useEffect(() => {
    animatePageIn();
  }, []);
  const handleCodeChange = (e: any) => {
    const value = e.target.value;
    const formattedValue = value.replace(/\D/g, "").slice(0, 6);
    setCode(formattedValue);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    if (!emailAddress.includes("@lp.com.vn")) {
      setError("Please enter a valid email address.");
      return;
    }
    var ciphertext = CryptoJS.AES.encrypt(password, "1").toString();
    let user = await axios.post("/api/authLDAP", {
      emailAddress,
      password: ciphertext,
      // department,
    });

    if (!user.data) {
      setError("User not found.");
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
        // Grab the emailAddressId
        try {
          const { emailAddressId }: any = emailCodeFactor;

          // Send the OTP code to the user
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId,
          });

          // Set 'verifying' true to display second form and capture the OTP code
          setPendingVerification(true);
        } catch (error: any) {
          setError(error.errors[0].longMessage);
        }
      }
    } catch (err: any) {
      setError(err.errors[0].longMessage);
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
      <div
        id="banner-1"
        className="min-h-screen bg-neutral-950 z-10 fixed top-0 left-0 w-1/4"
      />
      <div
        id="banner-2"
        className="min-h-screen bg-neutral-950 z-10 fixed top-0 left-1/4 w-1/4"
      />
      <div
        id="banner-3"
        className="min-h-screen bg-neutral-950 z-10 fixed top-0 left-2/4 w-1/4"
      />
      <div
        id="banner-4"
        className="min-h-screen bg-neutral-950 z-10 fixed top-0 left-3/4 w-1/4"
      />
      <div className="relative">
        <div className="absolute mt-1 top-0 right-0">
          <ModeToggle />
        </div>
      </div>
      <div className="mb-4 flex justify-center">
        <Logo />
      </div>
      <h1
        className="text-2xl font-semibold mb-4 text-center  
        bg-gradient-to-r bg-clip-text  text-transparent 
        dark:from-indigo-500 dark:via-green-500 dark:to-indigo-500
        from-blue-800 via-indigo-900 to-gray-900
        animate-text"
      >
        Lien Phat Learning System
      </h1>
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
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Sign In
        </button>
        <Link href={"/sign-up"}>
          <button className="w-full bg-gray-300 mt-2 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300">
            Switch Sign Up
          </button>
        </Link>
      </form>
      {/* Xác minh mã nếu cần */}
      {/* Hiển thị phần xác minh mã nếu pendingVerification là true */}
      {pendingVerification && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-zinc-950">
            <div className="flex justify-end">
              <button
                onClick={() => setPendingVerification(false)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <h2 className="text-xl font-bold mb-4 text-center">
              Email Verification
            </h2>
            <p className="mb-2 text-center text-gray-600">
              We sent a code to <strong>{emailAddress}</strong>
            </p>
            <form className="flex flex-col space-y-4">
              <div>
                {/* <label htmlFor="code">Code</label> */}
                <input
                  onChange={handleCodeChange}
                  id="code"
                  name="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  value={code}
                />
              </div>
              <button
                onClick={onPressVerify}
                className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
