import { db } from "@/lib/db";
import { Course } from "@prisma/client";

const groupByCourse = () => {
  const grouped: { [courseTitle: string]: number } = {};

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
