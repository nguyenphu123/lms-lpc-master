"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import axios from "axios";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useState } from "react";
import { Modal } from "../modals/modal";

export const ProgramCourseCell = ({ row }: any) => {
  const { courseWithProgram } = row.original;
  const [isModalOpen, setModalOpen] = useState(false);

  const courseTitles = courseWithProgram.map(
    (item: { course: { title: string } }) => item.course.title
  );

  return (
    <>
      <button
        className="text-blue-500 underline"
        onClick={() => setModalOpen(true)}
      >
        Detail ({courseWithProgram.length})
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Program Courses"
        items={courseTitles}
      />
    </>
  );
};
