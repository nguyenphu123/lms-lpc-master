import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getUser } from "@/actions/get-user";
import axios from "axios";
import { useQuery } from "react-query";

const UserReportPage = () => {
  const fetchAllUsers = async () => {
    const { data } = await axios.get(`/api/users`);

    return data;
  };

  const { data, error, isLoading } = useQuery("allPrograms", fetchAllUsers);
  console.log(data);
  return (
    <div className="p-6">
      {/* <DataTable
        columns={columns}
        data={users}
       
      /> */}
    </div>
  );
};

export default UserReportPage;
