"use client";
import { useState } from "react";
import { Pencil, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
const UserInformation = ({ user }: any) => {
  const router = useRouter();
  const [isRoleEditing, setIsRoleEditing] = useState(false);
  const [isDepartmentEditing, setIsDepartmentEditing] = useState(false);
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const [isStatusEditing, setIsStatusEditing] = useState(false);

  const handleRoleEditClick = () => {
    setIsRoleEditing(!isRoleEditing);
  };

  const handleStatusEditClick = () => {
    setIsStatusEditing(!isStatusEditing);
  };

  const handleDepartmentEditClick = () => {
    setIsDepartmentEditing(!isDepartmentEditing);
  };

  const handleUsernameEditClick = () => {
    setIsUsernameEditing(!isUsernameEditing);
  };

  const submitEdit = async (e: any) => {
    e.preventDefault();
    setIsRoleEditing(false);
    setIsDepartmentEditing(false);
    setIsUsernameEditing(false);
    setIsStatusEditing(false);
    let values = {
      department: e.target.department.value,
      role: e.target.role.value,
      username: e.target.username.value,
      status: e.target.status.value,
    };

    await axios.patch(`/api/user/${user?.id}`, values);
    router.refresh();
  };
  return (
    <form
      onSubmit={(e) => submitEdit(e)}
      className="text-black grid grid-cols-2 gap-4 p-4 rounded-md border bg-gradient-to-r from-blue-400 to-red-500 shadow-md"
    >
      {/* Left Column */}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          ID:
        </label>
        <input
          type="text"
          value={user?.id}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none "
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Username:
        </label>
        <div className="relative">
          <input
            type="text"
            name="username"
            autoCapitalize={"characters"}
            defaultValue={user?.username}
            readOnly={!isUsernameEditing}
            className={`w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none${
              isUsernameEditing ? "border-blue-500" : ""
            }`}
          />
          <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={handleUsernameEditClick}
          >
            {isUsernameEditing ? (
              <X className="text-blue-500 w-5 h-5" />
            ) : (
              <Pencil className="text-blue-500 w-5 h-5" />
            )}
          </div>
        </div>
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
            defaultValue={user?.Department.title}
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
          Star
        </label>
        <input
          type="text"
          value={user?.star}
          readOnly
          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 pointer-events-none"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Status:
        </label>
        <div className="relative bg-gray-100 border border-gray-300 rounded-md  text-black">
          <select
            defaultValue={user?.status}
            name="status"
            disabled={!isStatusEditing}
            // style={{backgroundColor:"#f3f4f6",textColor:"#11111"}}
            className={`appearance:none w-full bg-gray-100 border border-gray-300 rounded-md p-2 ${
              isStatusEditing ? "border-blue-500" : ""
            }`}
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>

          <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={handleStatusEditClick}
          >
            {isStatusEditing ? (
              <X className="text-blue-500 w-5 h-5" />
            ) : (
              <Pencil className="text-blue-500 w-5 h-5" />
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2 text-right">
        {isDepartmentEditing ||
        isRoleEditing ||
        isStatusEditing ||
        isUsernameEditing ? (
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
