"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const CourseHistory = ({ userId }: any) => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [uncompletedCourses, setUncompletedCourses] = useState([]);
  useEffect(() => {
    async function loadCourses() {
      let courseList = await axios.get(`/api/user/${userId}`);
      const completedCourses = courseList.data.ClassSessionRecord.filter(
        (course: any) => course.status == "finished"
      );
      setCompletedCourses(completedCourses);
      const uncompletedCourses = courseList.data.ClassSessionRecord.filter(
        (course: any) => course.status == "studying"
      );
      setUncompletedCourses(uncompletedCourses);
      // setCourses(courseList.data.ClassSessionRecord);
    }
    loadCourses();
  }, []);

  return (
    <div className="my-8 text-black dark:text-white">
      <div className="flex space-x-4">
        {/* Completed Courses Card */}
        <div className="bg-gradient-to-r from-blue-400 to-red-500 p-4 rounded-md border shadow-md flex-1">
          <h2 className="text-lg font-bold mb-4 text-white">
            Completed Courses
          </h2>
          <div className="mb-4">
            <span className="text-4xl font-bold text-white">
              {completedCourses.length}
            </span>
            <span className="ml-2 text-white">courses</span>
          </div>
          <div>
            {completedCourses.map((course: any, index: any) => (
              <p key={index} className="text-white">
                {course.title}
              </p>
            ))}
          </div>
        </div>

        {/* Uncompleted Courses Card */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-md border shadow-md flex-1">
          <h2 className="text-lg font-bold mb-4 text-white">
            Uncompleted Courses
          </h2>
          <div className="mb-4">
            <span className="text-4xl font-bold text-white">
              {uncompletedCourses.length}
            </span>
            <span className="ml-2 text-white">courses</span>
          </div>
          <div>
            {uncompletedCourses.map((course: any, index: any) => (
              <p key={index} className="text-white">
                {course.title}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHistory;
