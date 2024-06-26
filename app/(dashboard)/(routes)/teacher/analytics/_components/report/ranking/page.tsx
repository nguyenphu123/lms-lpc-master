"use client";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

import axios from "axios";
import { useQuery } from "react-query";

const RankingReportPage = () => {
  const fetchAllUsers = async () => {
    const { data } = await axios.get(`/api/users`);

    return data;
  };

  const { data, error, isLoading } = useQuery(
    "allUsersRanking",
    fetchAllUsers,
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <></>;
  } else {
    return (
      <div className="p-6">
        <DataTable columns={columns} data={data} />
      </div>
    );
  }
};

export default RankingReportPage;
