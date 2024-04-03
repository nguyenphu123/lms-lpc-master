"use client";
import ProgressBar from "@ramonak/react-progress-bar";
export default function DoughnutChart({ score }: any, { maxScore }: any) {
  console.log(score);
  console.log(maxScore);
  return <ProgressBar completed={score} maxCompleted={maxScore} />;
}
