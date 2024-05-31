"use client";
import { FormEvent, useState } from "react";
import { Pencil, Star, X } from "lucide-react";
import axios from "axios";
 
const UserInformation = ({ user }: any) => {
  const [isRoleEditing, setIsRoleEditing] = useState(false);
  const [isDepartmentEditing, setIsDepartmentEditing] = useState(false);
 
  const handleRoleEditClick = () => {
    setIsRoleEditing(!isRoleEditing);
  };
 
  const handleDepartmentEditClick = () => {
    setIsDepartmentEditing(!isDepartmentEditing);
  };
  const submitEdit = async (e: any) => {
    e.preventDefault();
    setIsRoleEditing(false);
    setIsDepartmentEditing(false);
    let values = {
      department: e.target.department.value.toUpperCase(),
      role: e.target.role.value.toUpperCase(),
    };
 
    await axios.patch(`/api/user/${user?.id}`, values);
  };
  return (
    <form
      onSubmit={(e) => submitEdit(e)}
      className=" text-black  grid grid-cols-2 gap-4 p-4 rounded-md border bg-gradient-to-r from-gray-800 to-blue-600 shadow-md"
    >
      {/* Left Column */}
      <div className="">
        <label className="block text-white text-sm font-bold mb-2">ID</label>
        <input
          type="text"
          value={user?.id}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none"
        />
      </div>
 
      <div>
        <label className="block text-white text-sm font-bold mb-2">
          Username
        </label>
        <input
          type="text"
          value={user?.username}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none"
        />
      </div>
 
      {/* Right Column */}
      <div>
        <label className="block text-white text-sm font-bold mb-2">Email</label>
        <input
          type="text"
          value={user?.email}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none"
        />
      </div>
 
      <div>
        <label className="block text-white text-sm font-bold mb-2">
          Department
        </label>
        <div className="relative">
          <input
            type="text"
            name="department"
            autoCapitalize={"characters"}
            defaultValue={user?.Department?.title}
            readOnly={!isDepartmentEditing}
            className={`w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none${
              isDepartmentEditing ? "border-blue-500" : ""
            }`}
          />
          {/* <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={handleDepartmentEditClick}
          >
            {isDepartmentEditing ? (
              <X className="text-blue-500 w-5 h-5" />
            ) : (
              <Pencil className="text-blue-500 w-5 h-5" />
            )}
          </div> */}
        </div>
      </div>
 
      <div>
        <label className="block text-white text-sm font-bold mb-2">Star</label>
        <input
          type="text"
          value={user?.star}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none"
        />
      </div>
      {/* <div className="col-span-2 text-right">
        {isDepartmentEditing || isRoleEditing ? (
          <button
            type="submit"
            className="bg-gradient-to-r from-black to-gray-800 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        ) : (
          <></>
        )}
      </div> */}
    </form>
  );
};
 
export default UserInformation;