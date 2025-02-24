"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Asterisk } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourcesFormProps {
  initialData: any;  // Assuming you have `initialData` here
  courseId: string;
}

export const ResourcesForm = ({ initialData, courseId }: ResourcesFormProps) => {
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const router = useRouter();

  // Fetch modules
  const fetchModules = async () => {
    try {
      const response = await axios.get(`/api/resources/module`);
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules", error);
    }
  };

  // Handle module selection
  const handleModuleSelect = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Handle form submission (add selected modules to the course)
  const onSubmit = async () => {
    if (selectedModules.length === 0) {
      toast.error("Please select at least one module.");
      return;
    }

    try {
      await axios.post(`/api/courses/${courseId}/chapters`, {
        modules: selectedModules,
      });
      toast.success("Modules added to the course");
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error submitting modules:", error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between text-black dark:text-slate-50">
        <div className="flex items-center">
          Course modules <Asterisk className="size-4" color="red" />
        </div>
      </div>

      {/* Modules list */}
      <div>
        <label>Select Modules:</label>
        <div>
          {modules.map((module: { id: string; title: string }) => (
            <div key={module.id} className="flex items-center">
              <input
                type="checkbox"
                id={module.id}
                checked={selectedModules.includes(module.id)}
                onChange={() => handleModuleSelect(module.id)}
              />
              <label htmlFor={module.id} className="ml-2">
                {module.title}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="button" onClick={onSubmit}>
        Add to Course
      </Button>

      {/* Display if no modules are added */}
      {!initialData.ModuleInCourse.length && (
        <div className="text-sm mt-2 text-slate-500 italic">No modules added</div>
      )}
    </div>
  );
};
