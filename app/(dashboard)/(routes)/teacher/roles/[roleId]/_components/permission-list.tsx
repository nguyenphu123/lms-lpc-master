"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface PermissionProps {
  id: string;
  title: string;
  roleId: string;
}
interface PermissionFormProps {
  initialData: PermissionProps[];
  roleId: string;
  permission: PermissionProps[];
}
const Permission = z.object({
  id: z.string(),
  title: z.string(),
});
const formSchema = z.array(Permission);

export const PermissionForm = ({ initialData, roleId, permission }: any) => {
  const [isEditing, setIsEditing] = useState(false);

  const [permissionList, setPermissionList] = useState(
    initialData.rolePermission
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const onChangePermissionList = useCallback(
    (e: any, permission: PermissionProps) => {
      // e.preventDefault();
      setPermissionList((items: PermissionProps[]) => {
        let checkIndex2 = items
          .map((val: any) => val.permissionId)
          .indexOf(permission.id);
        if (checkIndex2 > -1) {
          let tempList = [...permissionList];
          tempList.splice(checkIndex2, 1);

          return [...tempList];
        } else {
          let newItem = {
            permissionId: permission.id,
            permission,
          };
          return [...permissionList, newItem];
        }
      });
    },
    [permissionList]
  );
  // const onChangeDepartmentList = (e: any, department: DepartmentProps) => {

  // };
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async () => {
    try {
      await axios.patch(`/api/role/${roleId}/permission`, {
        permissionList,
      });
      toast.success("Role updated");
      // toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 text-black dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between dark:text-slate-50">
        <span>Permissions</span>
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
        <>
          {permission.map((item: any, i: any) => {
            return (
              <div
                key={item.id}
                className="flex items-center dark:text-slate-50"
              >
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
                  className="mr-2"
                />
                <label htmlFor={`permission-${item.id}`}>{item.title}</label>
              </div>
            );
          })}
          <div className="flex items-center gap-x-2">
            <Button onClick={() => onSubmit()} type="button">
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
