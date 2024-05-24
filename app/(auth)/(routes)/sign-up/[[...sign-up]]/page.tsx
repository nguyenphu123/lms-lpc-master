"use client";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useAuth, useSignUp } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Link from "next/link";

import dynamic from "next/dynamic";
import { ModeToggle } from "@/components/ui/theme-button";

import { Loader2 } from "lucide-react";
import { useQuery } from "react-query";
const Logo = dynamic(() => import("@/app/(auth)/_component/logo" as string), {
  ssr: false,
});
export default function Page() {
  const [error, setError] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [confirmCode, setConfirmCode]: any = useState("");
  const confetti = useConfettiStore();
  const [departmentOptions, setDepartmentOptions] = useState([]);
  useEffect(() => {
    async function getDepartments() {
      let departmentList = await axios.get(`/api/departments`);
      setDepartmentOptions(departmentList.data);
    }

    getDepartments();
  }, []);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [department, setDepartment] = useState("");
  const [verificationChecking, setVerificationChecking] = useState(false);
  const router = useRouter();
  const { isSignedIn }: any = useAuth();
  if (isSignedIn) {
    router.push("/");
  }
  // useEffect(() => {
  //   animatePageIn();
  // }, []);
  if (!isLoaded) {
    // Handle loading state
    return null;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!emailAddress.includes("@lp.com.vn")) {
      setError("Please enter a valid email address.");
      return;
    }

    let user = await axios.post("/api/checkLDAP", {
      emailAddress,
      // password,
      // department,
    });
    if (!user.data) {
      setError("User not found.");
      return;
    }

    if (!department) {
      setError("Please select a department.");
      return;
    }
    setUsername(user.data.cn);
    try {
      await signUp.create({
        emailAddress,
        // username,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors[0].longMessage);
    }
  };
  // This verifies the user using email code that is delivered.
  const onPressVerify = async (e: any) => {
    e.preventDefault();
    setVerificationChecking(true);
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp: any = await signUp.attemptEmailAddressVerification({
        code: confirmCode,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
        setVerificationChecking(false);
      }
      if (completeSignUp.status === "complete") {
        completeSignUp["department"] = department;
        completeSignUp["username"] = username;
        await axios.post(`/api/signup`, completeSignUp);

        confetti.onOpen();
        await setActive({ session: completeSignUp.createdSessionId });
        setTimeout(function () {
          // function code goes here
        }, 2000);

        router.push("/pending");
      }
    } catch (err: any) {
      setError(err.errors[0].longMessage);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-8 border border-gray-300 p-6 rounded-lg">
      {/* <div
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
      /> */}
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
        Slot registration page
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div>
          <label htmlFor="username" className="block mb-1">
            Name
          </label>
          <input
            type="text"
            id="username"
            placeholder="Nguyen Van A"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div> */}
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="text"
            id="email"
            placeholder="@lp.com.vn"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="department" className="block mb-1">
            Department
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          >
            <option value="">Select department</option>
            {departmentOptions.map((option: any) => (
              <option key={option.id} value={option.title}>
                {option.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Sign Up
        </button>
        <Link href={"/sign-in"}>
          <button className="w-full bg-gray-300 mt-2 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300">
            Switch Sign In
          </button>
        </Link>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
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
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                value={confirmCode}
                placeholder="Enter 6-digit code"
                onChange={(e) => {
                  const value = e.target.value;
                  const formattedValue = value.replace(/\D/g, "").slice(0, 6);
                  setConfirmCode(formattedValue);
                }}
              />
              <button
                onClick={onPressVerify}
                className="bg-blue-500 justify-center text-white inline-flex py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                <span>Confirm</span>
                {verificationChecking ? <Loader2 /> : <></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
