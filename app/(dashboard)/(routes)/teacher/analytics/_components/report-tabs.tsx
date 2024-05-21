"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReportPageCourse from "./report/course/page";
import ReportPageProgram from "./report/program/page";
import UserReportPage from "./report/user/page";

export const ReportTabs = () => {
  return (
    <Tabs defaultValue="users" aria-label="Options">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="programs">Programs</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <UserReportPage></UserReportPage>
      </TabsContent>
      <TabsContent value="programs">
        <ReportPageProgram></ReportPageProgram>
      </TabsContent>
      <TabsContent value="courses">
        <ReportPageCourse />
      </TabsContent>
    </Tabs>
  );
};
