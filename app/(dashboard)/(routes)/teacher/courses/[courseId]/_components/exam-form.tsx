"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Asterisk } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamFormProps {
  initialData: any;
  courseId: string;
}

export const ExamForm = ({ initialData, courseId }: ExamFormProps) => {
  const [exams, setExams] = useState([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const router = useRouter();

  // Fetch exams from the backend
  const fetchExams = async () => {
    try {
      const response = await axios.get(`/api/resources/exam`);
      setExams(response.data); // Populate exams list
    } catch (error) {
      console.error("Error fetching exams", error);
    }
  };

  // Fetch the selected exams for the course
  const fetchSelectedExams = async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/exams`);
      const selectedExams = response.data.map((exam: { examId: string }) => exam.examId);
      setSelectedExams(selectedExams);
    } catch (error) {
      console.error("Error fetching selected exams", error);
    }
  };

  // Handle exam selection or deselection
  const handleExamSelect = (examId: string) => {
    setSelectedExams((prev) =>
      prev.includes(examId)
        ? prev.filter((id) => id !== examId) // Deselect exam
        : [...prev, examId] // Select exam
    );
  };

  // Handle form submission to add exams to the course
  const onSubmit = async () => {
    try {
      await axios.post(`/api/courses/${courseId}/exams`, {
        exams: selectedExams, // Send selected exam IDs to the API
      });
      toast.success("Exams added to the course");
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error submitting exams:", error);
    }
  };

  // Fetch exams and selected exams when the component mounts or courseId changes
  useEffect(() => {
    fetchExams();
    fetchSelectedExams();
  }, [courseId]); // Re-fetch when courseId changes

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between text-black dark:text-slate-50">
        <div className="flex items-center">
          Course exams <Asterisk className="size-4" color="red" />
        </div>
      </div>

      {/* Exams list */}
      <div>
        <label>Select Exams:</label>
        <div>
          {exams.map((exam: { id: string; title: string }) => (
            <div key={exam.id} className="flex items-center">
              <input
                type="checkbox"
                id={exam.id}
                checked={selectedExams.includes(exam.id)}
                onChange={() => handleExamSelect(exam.id)}
              />
              <label htmlFor={exam.id} className="ml-2">
                {exam.title}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="button" onClick={onSubmit}>
        Add to Course
      </Button>

      {/* Display if no exams are added */}
      {(!initialData?.ExamInCourse || initialData.ExamInCourse.length === 0) && (
        <div className="text-sm mt-2 text-slate-500 italic">No exams added</div>
      )}
    </div>
  );
};
