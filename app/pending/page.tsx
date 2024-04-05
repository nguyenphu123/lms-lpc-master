import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BasicNavbar } from "./_component/course-navbar";
import Image from "next/image";

const StepTwo = async () => {
  const { sessionClaims }: any = auth();
  if (!sessionClaims?.userId) {
    return redirect("/");
  }

  return (
    <>
      <div className="h-[80px] fixed inset-y-0 w-full z-50">
        <BasicNavbar userId={sessionClaims?.userId} />
      </div>
      <div className="p-6 flex items-center justify-center mt-24">
        <div className="text-center">
          <p className="mb-4 text-4xl">Sorry!</p>
          <p className="mb-4">
            Your organization requires admin approval before you can sign in to
            LPC Learning System.
          </p>
          <p>Please contact your administrator for permission.</p>
          <Image
            className="mx-auto my-auto mt-6"
            src="/hourglass.png"
            alt="Contact Administrator"
            width={200}
            height={200}
          />
          {/* <SignOutButton /> */}
        </div>
      </div>
    </>
  );
};

export default StepTwo;
