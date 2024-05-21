"use client";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import axios from "axios";
import { useQuery } from "react-query";

const ReportPageProgram = () => {
  const fetchAllPrograms = async () => {
    const { data } = await axios.get(`/api/programs`);

    return data;
  };

  const { data, error, isLoading } = useQuery("allPrograms", fetchAllPrograms, {
    refetchOnWindowFocus: false,
  });

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

export default ReportPageProgram;
