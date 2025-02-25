"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Asterisk } from "lucide-react";
import { toast } from "react-hot-toast"; // Corrected import for react-hot-toast

interface ModuleDepartmentProps {
    moduleId: string;
    initialDepartmentId: string | null;
}

export const ModuleDepartment = ({ moduleId, initialDepartmentId }: ModuleDepartmentProps) => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(initialDepartmentId);

    // Fetch available departments
    const fetchDepartments = async () => {
        try {
            const response = await axios.get("/api/department"); // Assume there's an endpoint to fetch departments
            setDepartments(response.data); // Assuming data is an array of departments
        } catch (error) {
            console.error("Error fetching departments", error);
            toast.error("Failed to fetch departments");
        }
    };

    // Handle department change
    const handleDepartmentChange = (departmentId: string) => {
        setSelectedDepartment(departmentId);
    };

    // Update department for module
    const updateModuleDepartment = async () => {
        if (!selectedDepartment) {
            toast("Please select a department", { icon: "⚠️" });
            return;
        }

        try {
            await axios.patch(`/api/resources/module/${moduleId}`, {
                departmentId: selectedDepartment,
            });
            toast.success("Department updated successfully");
        } catch (error) {
            console.error("Error updating department", error);
            toast.error("Failed to update department");
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="mt-6 border dark:text-white rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
            <div className="flex items-center">
          Assign Department <Asterisk className="size-4" color="red" />
        </div>
        </div>

            <div className="space-y-4 mt-4">
                {departments.map((department: { id: string; title: string }) => (
                    <div key={department.id} className="flex items-center space-x-4">
                        <input
                            type="radio"
                            id={department.id}
                            name="department"
                            value={department.id}
                            checked={selectedDepartment === department.id}
                            onChange={() => handleDepartmentChange(department.id)}
                            className="cursor-pointer accent-indigo-500"
                        />
                        <label htmlFor={department.id} className="text-sm text-gray-700">
                            {department.title}
                        </label>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={updateModuleDepartment} className="bg-black text-white px-4 py-2 rounded-md">
                    Save Department
                </Button>
            </div>
        </div>
    );
};
