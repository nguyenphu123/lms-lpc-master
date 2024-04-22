import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BasicNavbar } from "./_component/course-navbar";
import { db } from "@/lib/db";
import "@/css/clock.css";
import Image from "next/image";
const StepTwo = async () => {
  const { sessionClaims }: any = auth();
  if (!sessionClaims?.userId) {
    return redirect("/sign-in");
  }
  let userInfo = await db.user.findUnique({
    where: { id: sessionClaims.userId },
  });
  if (userInfo == undefined) {
    return redirect("/sign-in");
  }
  return (
    <>
      <div className="h-[80px] fixed inset-y-0 w-full z-50">
        <BasicNavbar userId={sessionClaims?.userId} />
      </div>
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-4xl mt-24">Successful! 🎉🎉🎉</p>
          {/* <p className="mb-4">
            Your organization requires admin approval before you can access to
            LPC Learning System.
          </p> */}
          <p className="mb-4">
            Thank you for your submission. Your request is currently under
            review.
          </p>
          <p className="mb-10">Please come back later.</p>
          {/* <p>
            Please contact your
            <a
              href={`mailto:khoa.nguyendang@lp.com.vn,phu.nguyen@lp.com.vn?cc=huy.nguyen@lp.com.vn&subject=Request%20for%20LPC%20Learning%20System%20Access&body=Dear%20Administrator,%0A%0AI%20am%20writing%20to%20request%20access%20to%20the%20LPC%20Learning%20System.%20Please%20approve%20my%20request%20so%20that%20I%20can%20begin%20using%20the%20system.%0A%0AThank%20you.`}
              className="text-blue-500"
            >
              {" "}
              administrator
            </a>{" "}
            for permission.
          </p> */}
          {/* <Image
            className="mx-auto my-auto mt-6"
            src="/hourglass.png"
            alt="Contact Administrator"
            width={200}
            height={200}
          /> */}
          <div className="flex justify-center items-center">
            <div className="loader"></div>
          </div>
          {/* <div className="relative w-full h-90 flex items-center justify-center rounded overflow-hidden mt-4">
            <Image
              src="https://media.giphy.com/media/l3vR1tvIhCrrZsty0/giphy.gif"
              alt="blog"
              height={400}
              width={400}
              className="select-none object-cover rounded-md border-2 border-white shadow-md drop-shadow-md w-150 h-full"
            />
          </div> */}
          {/* <SignOutButton /> */}
        </div>
      </div>
    </>
  );
};

export default StepTwo;
