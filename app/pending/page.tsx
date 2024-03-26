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
    <div className="p-6">
      {/* <UserButton
        afterSignOutUrl="/"
        defaultOpen={user.externalAccounts.length == 0 ? true : false}

        userProfileMode="modal"
      /> */}
      {user.externalAccounts.length == 0 ? (
        <LinkButton></LinkButton>
      ) : (
        <>
          Sorry you are not approved, please send money to admin to get approval
          <SignOutButton />
        </>
      )}
    </div>
  );
};

export default StepTwo;
