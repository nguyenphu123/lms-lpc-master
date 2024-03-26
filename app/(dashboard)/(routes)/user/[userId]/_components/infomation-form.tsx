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
      className=" text-black dark:text-white grid grid-cols-2 gap-4 p-4 rounded-md border bg-gradient-to-r from-blue-400 to-red-500 shadow-md"
    >
      {/* Left Column */}
      <div className="">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          ID:
        </label>
        <input
          type="text"
          value={user?.id}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Username:
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
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email:
        </label>
        <input
          type="text"
          value={user?.email}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Department:
        </label>
        <div className="relative">
          <input
            type="text"
            name="department"
            autoCapitalize={"characters"}
            defaultValue={user?.Department?.department}
            readOnly={!isDepartmentEditing}
            className={`w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none${
              isDepartmentEditing ? "border-blue-500" : ""
            }`}
          />
          <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={handleDepartmentEditClick}
          >
            {isDepartmentEditing ? (
              <X className="text-blue-500 w-5 h-5" />
            ) : (
              <Pencil className="text-blue-500 w-5 h-5" />
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Role:
        </label>
        <div className="relative bg-gray-100 border border-gray-300 rounded-md pointer-events-none text-black">
          <select
            defaultValue={user?.role}
            name="role"
            disabled={!isRoleEditing}
            // style={{backgroundColor:"#f3f4f6",textColor:"#11111"}}
            className={`appearance:none w-full bg-gray-100 border border-gray-300 rounded-md p-2 ${
              isRoleEditing ? "border-blue-500" : ""
            }`}
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={handleRoleEditClick}
          >
            {isRoleEditing ? (
              <X className="text-blue-500 w-5 h-5" />
            ) : (
              <Pencil className="text-blue-500 w-5 h-5" />
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Star
        </label>
        <input
          type="text"
          value={user?.star}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none"
        />
      </div>
      <div className="col-span-2 text-right">
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
      </div>
    </form>
  );
};

export default UserInformation;
