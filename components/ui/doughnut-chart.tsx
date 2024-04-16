"use client";
import ProgressBar from "@ramonak/react-progress-bar";
export default function DoughnutChart({ score }: any, { maxScore }: any) {
  return <ProgressBar completed={score} maxCompleted={maxScore} />;
}
