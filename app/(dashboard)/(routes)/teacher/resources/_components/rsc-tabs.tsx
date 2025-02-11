"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Module from "./rsc/module/page";
import Exam from "./rsc/exam/page";

export const ReportTabs = () => {
  return (
    <Tabs defaultValue="users" aria-label="Options">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="module">Module</TabsTrigger>
        <TabsTrigger value="exam">Exam</TabsTrigger>
      </TabsList>
      <TabsContent value="module">
        <Module/>
      </TabsContent>
      <TabsContent value="exam">
        <Exam />
      </TabsContent>
    </Tabs>
  );
};
