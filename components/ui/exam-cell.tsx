"use client";

import React, { useState } from "react";
import { Modal } from "../modals/modal-exam"; // Adjust the import path to where your Modal component is located

export const ExamsCell = ({ row }: any) => {
  const { Module } = row.original;
  const [isModalOpen, setModalOpen] = useState(false);

  const exams = Module.filter((item: any) => item.type === "Exam");

  const examDetails = exams.map((exam: any) => {
    const passedUsers = exam.UserProgress.filter(
      (item: { status: string }) => item.status === "finished"
    ).map((item: { user: { username: string } }) => item.user.username);

    const studyingUsers = exam.UserProgress.filter(
      (item: { status: string }) => item.status !== "finished"
    ).map((item: { user: { username: string }; progress: string }) => ({
      username: item.user.username,
      progress: parseFloat(item.progress),
    }));

    return {
      title: exam.title,
      passedCount: passedUsers.length,
      totalUsers: exam.UserProgress.length,
      passedUsers,
      studyingUsers,
    };
  });

  const totalExams = exams.length;

  return (
    <>
      <button
        className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
        onClick={() => setModalOpen(true)}
      >
        Details ({totalExams})
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        examDetails={examDetails}
      />
    </>
  );
};
