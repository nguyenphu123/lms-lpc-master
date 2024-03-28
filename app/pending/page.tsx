import { SignOutButton, UserButton, auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import LinkButton from "./_component/Link-Button";
const StepTwo = async () => {
  const { sessionClaims }: any = auth();
  if (!sessionClaims?.userId) {
    return redirect("/");
  }
  const user = await clerkClient.users.getUser(sessionClaims?.userId);

  return (
    <div className="p-6 flex items-center justify-center">
      {user.externalAccounts.length === 0 ? (
        <LinkButton />
      ) : (
        <div className="text-center">
          <p className="mb-4">Sorry, you are not approved.</p>
          <p className="mb-4">Please contact the administrator for approval.</p>
          <SignOutButton />
        </div>
      )}
    </div>
  );
};

export default StepTwo;
