"use client";
import { Tabs, Tab } from "@nextui-org/react";
import ReportPageCourse from "./report/course/page";
export const ReportTabs = () => {
  return (
    <Tabs aria-label="Options">
      <Tab key="users" title="Users"></Tab>
      <Tab key="programs" title="Programs"></Tab>
      <Tab key="courses" title="Courses">
        <ReportPageCourse></ReportPageCourse>
      </Tab>
    </Tabs>
  );
};
