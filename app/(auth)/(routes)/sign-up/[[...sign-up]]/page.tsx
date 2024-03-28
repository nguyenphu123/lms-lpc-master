"use client";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { clerkClient, useSignUp } from "@clerk/nextjs";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

import { useState } from "react";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [confirmCode, setConfirmCode]: any = useState("");
  const confetti = useConfettiStore();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        username,
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
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="*****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-2 flex items-center"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  width="15"
                  height="15"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  width="15"
                  height="15"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
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
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
