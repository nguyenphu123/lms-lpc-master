"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const Avatar = (userId: any) => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    async function loadCourses() {
      let courseList = await axios.get(`/api/user/${userId}`);

      setCourses(courseList.data);
    }
    loadCourses();
  });
  return courses.length == 0 ? (
    <div className="text-black dark:text-white">
      You have not finished any course.
    </div>
  ) : (
    <>
      {courses.map((course: any, index: any) => {
        <div className="text-black dark:text-white">{course.title}</div>;
      })}
    </>
  );
};

export default Avatar;
