"use client";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useSignUp } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [confirmCode, setConfirmCode]: any = useState("");
  const confetti = useConfettiStore();
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
      // password,
      // department,
    });

    if (!user.data) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        // username,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error) {
      console.log(error);
    }
    setPendingVerification(true);
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
        completeSignUp["username"] = username;
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
      <h1 className="text-2xl font-semibold mb-4">
        Please link your Lien Phat account
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
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
        </div>
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
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-zinc-950">
            <h2 className="text-xl font-bold mb-4 text-center">Verify Email</h2>
            <form className="flex flex-col space-y-4">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                value={confirmCode}
                placeholder="Code..."
                onChange={(e) => {
                  const value = e.target.value;
                  const formattedValue = value.replace(/\D/g, "").slice(0, 6);
                  setConfirmCode(formattedValue);
                }}
              />
              <button
                onClick={(e) => onPressVerify(e)}
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
