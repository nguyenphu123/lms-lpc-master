import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getAnalytics } from "@/actions/get-analytics";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  // const {
  //   data,
  //   totalRevenue,
  //   totalSales,
  // } = await getAnalytics(userId);

  return (
    <div className="p-6 flex items-center justify-center">
      <div className="text-center">
        <Image
          className="mx-auto my-auto mt-6"
          src="/barrier.png"
          alt="Under maintenance"
          width={250}
          height={250}
        />
        <p className="mb-4 text-4xl mt-6">Under maintenance 🛠</p>
        Hang tight! Our website is currently getting a makeover to bring you an
        even better experience. Please swing by again soon!
        <div className="relative w-full h-90 flex items-center justify-center rounded overflow-hidden mt-4"></div>
        {/* <SignOutButton /> */}
      </div>
    </div>
  );
};

export default AnalyticsPage;
