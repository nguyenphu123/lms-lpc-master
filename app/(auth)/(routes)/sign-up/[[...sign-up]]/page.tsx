"use client";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { clerkClient, useSignUp } from "@clerk/nextjs";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

import { useState } from "react";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [confirmCode, setConfirmCode]: any = useState("");
  const confetti = useConfettiStore();
  const [password, setPassword] = useState("");
  const departmentOptions = ["DEV", "SCC", "DSC", "AM", "BU2"];
  const [pendingVerification, setPendingVerification] = useState(false);
  const [department, setDepartment] = useState("");
  const router = useRouter();
  if (!isLoaded) {
    // Handle loading state
    return null;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!emailAddress.includes("@lp.com.vn")) {
      return;
    }

    let user = await axios.post("/api/checkLDAP", {
      emailAddress,
      password,
      department,
    });

    if (!user.data) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error) {
      console.log(error);
    }
  };
  // This verifies the user using email code that is delivered.
  const onPressVerify = async (e: any) => {
    e.preventDefault();
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
      }
      if (completeSignUp.status === "complete") {
        completeSignUp["department"] = department;
        await axios.post(`/api/signup`, completeSignUp);

        confetti.onOpen();
        await setActive({ session: completeSignUp.createdSessionId });
        setTimeout(function () {
          // function code goes here
        }, 3000);
        router.push("/pending");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email:
          </label>
          <input
            type="text"
            id="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label htmlFor="department" className="block mb-1">
            Department:
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          >
            <option value="">Select Department</option>
            {departmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Sign up
        </button>
      </form>
      {pendingVerification && (
        <div>
          <form>
            <input
              value={confirmCode}
              placeholder="Code..."
              onChange={(e) => setConfirmCode(e.target.value)}
            />
            <button onClick={(e) => onPressVerify(e)}>Verify Email</button>
          </form>
        </div>
      )}
    </div>
  );
}
