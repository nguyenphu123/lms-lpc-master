import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReportTabs } from "./_components/report-tabs";

// import Image from "next/image";
// import { getAnalytics } from "@/actions/get-analytics";

// import { DataCard } from "./_components/data-card";
// import { Chart } from "./_components/chart";

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

  return <ReportTabs></ReportTabs>;
};

export default AnalyticsPage;
