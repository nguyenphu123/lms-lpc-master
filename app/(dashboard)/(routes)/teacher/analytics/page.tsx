import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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

  return <div className="p-6">Under maintainence</div>;
};

export default AnalyticsPage;
