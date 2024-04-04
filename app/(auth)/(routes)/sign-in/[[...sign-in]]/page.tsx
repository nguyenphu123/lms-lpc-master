"use client";
import { useSignIn } from "@clerk/clerk-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmailCodeFactor, SignInFirstFactor } from "@clerk/types";
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
    <div>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={(e) => setEmailAddress(e.target.value)}
            id="email"
            name="email"
            type="email"
          />
        </div>
        <button onClick={handleSubmit}>Sign In</button>
        <button onClick={() => router.push("/sign-up")}>Sign Up</button>
      </form>
      {pendingVerification ? (
        <>
          <div>
            <label htmlFor="code">Code</label>
            <input
              onChange={(e) => setCode(e.target.value)}
              id="code"
              name="code"
              type="text"
            />
          </div>
          <button
            onClick={(e) => onPressVerify(e)}
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Verify
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
