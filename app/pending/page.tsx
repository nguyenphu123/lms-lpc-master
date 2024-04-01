import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BasicNavbar } from "./_component/course-navbar";

const StepTwo = async () => {
  const { sessionClaims }: any = auth();
  if (!sessionClaims?.userId) {
    return redirect("/");
  }

  return (
    <>
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <BasicNavbar userId={sessionClaims?.userId} />
      </div>
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Sorry, you are not approved.</p>
          <p className="mb-4">Please contact the administrator for approval.</p>
          {/* <SignOutButton /> */}
        </div>
      </div>
    </>
  );
};

export default StepTwo;
