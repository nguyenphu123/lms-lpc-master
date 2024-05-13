"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface PermissionProps {
  permissionId: string;
  title: string;
  roleId: string;
}
interface PermissionFormProps {
  initialData: PermissionProps[];
  permissionId: string;
  role: PermissionProps[];
}
const Permission = z.object({
  id: z.string(),
  title: z.string(),
});
const formSchema = z.array(Permission);

export const PermissionForm = ({
  initialData,
  userId,
  role,
  permission,
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [permissionList, setPermissionList] = useState([
    ...initialData.userPermission,
  ]);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const onChangePermissionList = (e: any, permission: PermissionProps) => {
    // e.preventDefault();
    let newPermissionList = [...permissionList];
    if (
      newPermissionList
        .map((item) => item.permissionId)
        .indexOf(permission.permissionId) != -1
    ) {
      newPermissionList.splice(
        newPermissionList
          .map((item) => item.permissionId)
          .indexOf(permission.permissionId),
        1
      );
    } else {
      let newItem = {
        permissionId: permission.permissionId,
        permission: permission,
        roleId: permission.roleId,
      };

      setPermissionList((prevState) => [...prevState, newItem]);
    }
  };
  const onChangePermissionListByRole = (e: any, role: any) => {
    if (currentRole == role.title) {
      setCurrentRole("");
      let newPermissionList = [...permissionList];
      for (let i = 0; i < newPermissionList.length; i++) {
        if (newPermissionList[i].roleId == role.roleId) {
          newPermissionList.splice(i, 1);
        }
      }
      setPermissionList([...newPermissionList]);
    } else {
      setCurrentRole(role.title);
      setPermissionList([]);
      for (let i = 0; i < role.rolePermission.length; i++) {
        let newItem = {
          permissionId: role.rolePermission[i].permissionId,
          permission: role.rolePermission[i].permission,
          roleId: role.rolePermission[i].roleId,
        };

        setPermissionList((prevState) => [...prevState, newItem]);
      }
    }

    // e.preventDefault();
  };

  // const onChangeDepartmentList = (e: any, department: DepartmentProps) => {

  // };
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async () => {
    try {
      await axios.patch(`/api/user/${userId}/permission`, {
        permissionList,
      });
      toast.success("Role updated");
      // toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    for (let i = 0; i < role.length; i++) {
      checkRole(role[i].title, role[i].rolePermission);
    }
  }, []);
  const checkRole = (title: any, permissions: any) => {
    let mapPermissions = permissions.map(
      (item: { permissionId: any }) => item.permissionId
    );
    let mapPermissionList = [...permissionList].map(
      (item: { permissionId: any }) => item.permissionId
    );

    if (JSON.stringify(mapPermissionList) === JSON.stringify(mapPermissions)) {
      if (currentRole == "") {
        setCurrentRole(title);
      }
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        permission
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <div className="dark: text-zinc-50">
          Set permission base on role
          <div className="grid grid-cols-5 gap-4">
            {role.map((item: any, i: any) => {
              return (
                <div key={item.id} className="dark:text-slate-50">
                  <input
                    onChange={(e) => onChangePermissionListByRole(e, item)}
                    disabled={isEditing ? false : true}
                    value={item.title}
                    type="checkbox"
                    checked={currentRole == item.title ? true : false}
                  />
                  {item.title}
                </div>
              );
            })}
          </div>
          Or Custom permission
          <div className="grid grid-cols-8 gap-16 w-full">
            {permission.map((item: any, i: any) => {
              return (
                <div key={item.id} className="dark:text-slate-50">
                  <input
                    onChange={(e) => onChangePermissionList(e, item)}
                    disabled={isEditing ? false : true}
                    value={item.title}
                    type="checkbox"
                    checked={
                      permissionList
                        .map((val: any) => val.permissionId)
                        .indexOf(item.id) != -1
                        ? true
                        : false
                    }
                  />
                  {item.title}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-x-2">
            <Button onClick={() => onSubmit()} type="button">
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
