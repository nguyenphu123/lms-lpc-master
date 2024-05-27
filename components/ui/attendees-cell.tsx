"use client";

import React, { useState } from "react";
import { Modal } from "../modals/modal-course"; // Adjust the import path to where your Modal component is located

export const AttendeesCell = ({ row }: any) => {
  const { ClassSessionRecord } = row.original;
  const [isModalOpen, setModalOpen] = useState(false);

  const passedUsers = ClassSessionRecord.filter(
    (item: { status: string }) => item.status === "finished"
  ).map((item: { user: { username: string } }) => item.user.username);

  const studyingUsers = ClassSessionRecord.filter(
    (item: { status: string }) => item.status !== "finished"
  ).map((item: { user: { username: string }; progress: string }) => ({
    username: item.user.username,
    progress: parseFloat(item.progress),
  }));

  const totalUsers = ClassSessionRecord.length;
  const passedCount = passedUsers.length;

  return (
    <>
      <button
        className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
        onClick={() => setModalOpen(true)}
      >
        Details ({passedCount}/{totalUsers})
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Attendees"
        passedUsers={passedUsers}
        studyingUsers={studyingUsers}
      />
    </>
  );
};
