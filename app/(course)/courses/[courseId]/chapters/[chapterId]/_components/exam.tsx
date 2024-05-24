"use client";
import { Countdown } from "@/hooks/use-countdown";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BookmarkCheck, Timer } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import shuffleArray from "@/lib/shuffle";
import DoughnutChart from "@/components/ui/doughnut-chart";
import Image from "next/image";
import { Prisma } from "@prisma/client";

const Exam = ({
  chapter,
  nextChapterId,
  courseId,
  course,
  isCompleted,
}: any) => {
  const router = useRouter();

  const [categoryList, setCategoryList]: any = useState([...chapter.Category]);
  const [finishedExam, setFinishedExam] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLimit, setTimeLimit]: any = useState(chapter.timeLimit);
  const [maxAttempt, setMaxAttempt]: any = useState(chapter.maxAttempt);
  const [timeLimitRecord, setTimeLimitRecord]: any = useState(
    chapter.timeLimit * 60
  );
  const [questions, setQuestions]: any = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examMaxScore, setExamMaxSocre] = useState(0);
  const [selectedAnswers, setSelectedAnswers]: any = useState([]);
  const [onFinish, setOnFinish] = useState(false);
  const [exemRecord, setExamRecord]: any = useState([]);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [reportId, setReportId] = useState("");
  // const [recordId, setRecordId] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const confetti = useConfettiStore();
  const [currentAttempt, setCurrentAttempt] = useState(0);
  useEffect(() => {
    const getHistory = async () => {
      let getLatestTestResult: any = await axios.get(
        `/api/courses/${courseId}/chapters/${chapter.id}/category/exam`
      );
      if (getLatestTestResult.data?.UserProgress[0]?.status == "finished") {
      } else {
      }

      setFinishedExam(
        getLatestTestResult.data?.UserProgress[0]?.status == "finished"
          ? true
          : false
      );
      setCurrentAttempt(
        getLatestTestResult.data?.UserProgress[0]?.retakeTime != undefined
          ? getLatestTestResult.data?.UserProgress[0]?.retakeTime
          : 0
      );
      setFinalScore(getLatestTestResult.data?.UserProgress[0]?.score);
      setCategoryList(getLatestTestResult.data?.Category);
      let currentUser = await axios.get(`/api/user`);
      setCurrentUserId(currentUser.data.id);

      let getLatestExamRecord: any = await axios.get(
        `/api/user/${currentUser.data.id}/examRecord/${chapter.id}`
      );

      setExamRecord(getLatestExamRecord.data);
      let chekIfUserIsInExam: any = await axios.get(
        `/api/user/${currentUser.data.id}/isInExam`
      );

      if (
        chekIfUserIsInExam?.data?.isInExam == true &&
        chapter.id == chekIfUserIsInExam?.data?.moduleId
      ) {
        setReportId(chekIfUserIsInExam?.data?.id);
        const examObj: any = chekIfUserIsInExam?.data
          ?.examRecord as Prisma.JsonObject;

        setQuestions(examObj.questionList);
        setCurrentQuestion(examObj.currentQuestion);
        if (!examObj.isEmergency) {
          let timeLeft =
            Math.round(
              new Date().getTime() - chekIfUserIsInExam?.data?.date?.getTime()
            ) / 60000;
          setTimeLimit(timeLeft);
          setTimeLimitRecord(timeLeft);
        } else {
          setTimeLimit(examObj.timeLimit);
          setTimeLimitRecord(examObj.timeLimit * 60);
        }

        setSelectedAnswers(examObj.selectedAnswers);
        setCurrentAttempt(examObj.currentAttempt);
        // accept();
      }
    };
    getHistory();
  }, []);
  useEffect(() => {
    if (questions.length > 0) {
      const interval = setInterval(() => {
        setTimeLimitRecord((prev: number) => {
          if (prev === 0) {
            clearInterval(interval);
            onTimeOut();
            return prev;
          }
          return prev - 1;
        });
      }, 60000);
    }
  }, [timeLimitRecord, questions]);
  useEffect(() => {
    if (questions.length > 0) {
      window.addEventListener("beforeunload", alertUser);
      return () => {
        window.removeEventListener("beforeunload", alertUser);
      };
    }
  }, [questions, reportId, selectedAnswers, timeLimitRecord, currentQuestion]);
  const alertUser = async (e: any) => {
    navigator.sendBeacon(
      `/api/user/${currentUserId}/isInExam`,
      JSON.stringify({
        id: reportId,
        isInExam: true,
        note: "Sudden tabs or browser close.",
        moduleId: chapter.id,
        courseId,
        date: new Date(),
        examRecord: {
          questionList: questions,
          timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
          currentQuestion: currentQuestion,
          selectedAnswers: selectedAnswers,
          isEmergency: false,
          currentAttempt: currentAttempt,
        },
      })
    );

    if (questions.length == 0) {
    } else {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  const onTimeOut: any = async () => {
    if (questions.length == 0) {
      await axios.post(
        `/api/user/${currentUserId}/examRecord/${chapter.id}`,
        JSON.stringify({
          moduleId: chapter.id,
          courseId,
          date: new Date(),
          examRecord: {
            questionList: questions,

            selectedAnswers: selectedAnswers,
          },
        })
      );
    } else {
      const { finalScore }: any = calculateScore();
      const totalScore = finalScore;

      if (!finishedExam) {
        const date = new Date();
        if (currentAttempt == maxAttempt) {
          await axios.put(
            `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
            {
              status: totalScore >= chapter.scoreLimit ? "finished" : "failed",
              score: parseInt(finalScore),
              progress: "100%",
              endDate: date,
              retakeTime: currentAttempt,
            }
          );
        } else {
          await axios.put(
            `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
            {
              status:
                totalScore >= chapter.scoreLimit ? "finished" : "studying",
              score: parseInt(finalScore),
              progress: "100%",
              endDate: date,
              retakeTime: currentAttempt,
            }
          );
        }

        if (totalScore >= chapter.scoreLimit) {
          if (nextChapterId != null) {
            let checkIfNextChapterIsFinished = await axios.get(
              `/api/courses/${courseId}/chapters/${nextChapterId}/progress`
            );
            if (checkIfNextChapterIsFinished.data.status == "finished") {
              if (
                checkIfNextChapterIsFinished.data.nextChapterId != undefined
              ) {
              } else {
                await axios.put(`/api/courses/${courseId}/progress`, {
                  status: "finished",
                  progress: "100%",
                  endDate: date,
                });
                confetti.onOpen();
                let currentUser = await axios.get(`/api/user`);
                await axios.patch(`/api/user/${currentUser.data.id}/score`, {
                  star:
                    parseInt(currentUser.data.star) + parseInt(course.creadit),
                  starUpdateDate: new Date(),
                });
              }
            } else {
              await axios.put(
                `/api/courses/${courseId}/chapters/${nextChapterId}/progress`,
                {
                  status: "studying",
                  progress: "0%",
                  startDate: date,
                }
              );
              await axios.put(`/api/courses/${courseId}/progress`, {
                status: "studying",
                progress:
                  (course.Module.map((item: { id: any }) => item.id).indexOf(
                    nextChapterId
                  ) /
                    course.Module.length) *
                    100 +
                  "%",
                startDate: date,
              });
            }
            //router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
          } else {
            await axios.put(`/api/courses/${courseId}/progress`, {
              status: "finished",
              progress: "100%",
              startDate: date,
            });
            confetti.onOpen();
            let currentUser = await axios.get(`/api/user`);
            await axios.patch(`/api/user/${currentUser.data.id}/score`, {
              star: parseInt(currentUser.data.star) + parseInt(course.creadit),
              starUpdateDate: new Date(),
            });
          }
        }
        if (isCompleted != "finished") {
          await axios.post(
            `/api/user/${currentUserId}/examRecord/${chapter.id}`,
            JSON.stringify({
              courseId,
              date: new Date(),
              examRecord: {
                questionList: questions,

                selectedAnswers: selectedAnswers,
              },
            })
          );
        }
      }
      await axios.post(
        `/api/user/${currentUserId}/isInExam`,
        JSON.stringify({
          id: reportId,
          isInExam: false,
          note: "Finished exam.",
          moduleId: chapter.id,
          courseId,
          date: new Date(),
          examRecord: {
            questionList: questions,
            timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
            currentQuestion: currentQuestion,
            selectedAnswers: selectedAnswers,
            currentAttempt: currentAttempt,
          },
        })
      );

      setOnFinish(true);
      setQuestions([]);
      // let currentUser = await axios.get(`/api/user`);
      // await axios.patch(
      //   `/api/user/${currentUser.data.id}/examRecord/${chapter.id}`,
      //   examRecord
      // );
      if (totalScore >= chapter.scoreLimit) {
        if (nextChapterId != null) {
          setTimeout(function () {
            // function code goes here
          }, 10000);
          router.push(`/`);
          router.refresh();
        }
      }
    }
    let currentUser = await axios.get(`/api/user`);
    await axios.patch(`/api/user/${currentUser.data.id}/isInExam`, {
      id: reportId,
      values: {
        isInExam: false,
        moduleId: chapter.id,
        courseId,
      },
    });
    router.refresh();
  };

  // Danh sách câu hỏi và đáp án

  // useEffect(() => {
  //   async function loadQuestion() {}
  //   loadQuestion();
  // }, []);
  const accept = async () => {
    setFinalScore(0);
    // setFinishedExam(false);
    setOnFinish(false);
    setTimeLimit(chapter.timeLimit);
    setCurrentQuestion(0);
    setSelectedAnswers([]);

    setIsGeneratingExam(true);
    let questionLists: any = [];
    if (!finishedExam) {
      setCurrentAttempt(currentAttempt + 1);
      let questionList = await axios.get(
        `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam/shuffle`
      );
      questionLists = shuffleArray(questionList.data.ExamList);
      setQuestions(questionLists);
    } else {
      let questionList = await axios.get(
        `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam/shuffle`
      );

      questionLists = shuffleArray(questionList.data.ExamList);
      setQuestions(questionLists);
    }
    let currentUser = await axios.get(`/api/user`);
    let report = await axios.post(`/api/user/${currentUser.data.id}/isInExam`, {
      id: "0",
      examRecord: {
        questionList: questionLists,
        timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
        currentQuestion: 0,
        selectedAnswers: [],
        currentAttempt: currentAttempt,
      },
      note: "",
      isInExam: true,
      moduleId: chapter.id,
      date: new Date(),
      courseId,
    });
    setReportId(report.data.id);
    setIsGeneratingExam(false);
  };
  // const cancel = () => {
  //   return redirect(`/courses`);
  // };
  // State để theo dõi câu hỏi hiện tại, điểm số và đáp án đã chọn cho từng câu hỏi

  // Hàm xử lý khi người dùng chọn một đáp án
  const handleAnswerClick = async (question: any, option: any) => {
    const updatedAnswers: any = [...selectedAnswers];

    if (
      "chooseAnswer" in question &&
      question["chooseAnswer"]
        .map((item: { id: any }) => item.id)
        .indexOf(option.id) != -1
    ) {
      let indexOf = question["chooseAnswer"]
        .map((item: { id: any }) => item.id)
        .indexOf(option.id);
      question["chooseAnswer"].splice(indexOf, 1);
      updatedAnswers[currentQuestion] = question;

      setSelectedAnswers(updatedAnswers);
    } else {
      // Lưu câu trả lời đã chọn vào state
      if (question.type == "singleChoice") {
        question["chooseAnswer"] = [];
        question["chooseAnswer"] = [...question["chooseAnswer"], option];
        updatedAnswers[currentQuestion] = question;
        setSelectedAnswers(updatedAnswers);
      } else {
        // question["chosedAnswer"] = [];
        if (!("chooseAnswer" in question)) {
          question["chooseAnswer"] = [];
        }
        question["chooseAnswer"] = [...question["chooseAnswer"], option];
        updatedAnswers[currentQuestion] = question;

        setSelectedAnswers(updatedAnswers);
      }
    }
    await axios.post(
      `/api/user/${currentUserId}/isInExam`,
      JSON.stringify({
        id: reportId,
        isInExam: true,
        note: "",
        moduleId: chapter.id,
        courseId,
        date: new Date(),
        examRecord: {
          questionList: questions,
          timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
          currentQuestion: currentQuestion,
          selectedAnswers: updatedAnswers,
          currentAttempt: currentAttempt,
        },
      })
    );
  };

  // Hàm xử lý khi người dùng chọn nút "Next"
  const handleNextClick = async () => {
    // Chuyển sang câu hỏi tiếp theo
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      await axios.post(
        `/api/user/${currentUserId}/isInExam`,
        JSON.stringify({
          id: reportId,
          isInExam: true,
          note: "",
          moduleId: chapter.id,
          courseId,
          date: new Date(),
          examRecord: {
            questionList: questions,
            timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
            currentQuestion: nextQuestion,
            selectedAnswers: selectedAnswers,
            currentAttempt: currentAttempt,
          },
        })
      );
    } else {
      // Nếu đã là câu hỏi cuối cùng, kiểm tra điểm số và hiển thị kết quả
      const { finalScore }: any = calculateScore();
      const totalScore = finalScore;
      if (isCompleted != "finished") {
        await axios.post(
          `/api/user/${currentUserId}/examRecord/${chapter.id}`,
          JSON.stringify({
            moduleId: chapter.id,
            courseId,
            date: new Date(),
            examRecord: {
              questionList: questions,

              selectedAnswers: selectedAnswers,
            },
          })
        );
      }

      if (!finishedExam) {
        const date = new Date();

        if (currentAttempt == maxAttempt) {
          await axios.put(
            `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
            {
              status: totalScore >= chapter.scoreLimit ? "finished" : "failed",
              score: parseInt(finalScore),
              progress: totalScore >= chapter.scoreLimit ? "100%" : "0%",
              endDate: date,
              retakeTime: currentAttempt,
            }
          );
        } else {
          await axios.put(
            `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
            {
              status:
                totalScore >= chapter.scoreLimit ? "finished" : "studying",
              score: parseInt(finalScore),
              progress: totalScore >= chapter.scoreLimit ? "100%" : "0%",
              endDate: date,
              retakeTime: currentAttempt,
            }
          );
        }
        if (totalScore >= chapter.scoreLimit) {
          if (nextChapterId != null) {
            let checkIfNextChapterIsFinished = await axios.get(
              `/api/courses/${courseId}/chapters/${nextChapterId}/progress`
            );
            if (checkIfNextChapterIsFinished.data.status == "finished") {
              if (
                checkIfNextChapterIsFinished.data.nextChapterId != undefined
              ) {
              } else {
                await axios.put(`/api/courses/${courseId}/progress`, {
                  status: "finished",
                  progress: "100%",
                  endDate: date,
                });
              }
            } else {
              await axios.put(
                `/api/courses/${courseId}/chapters/${nextChapterId}/progress`,
                {
                  status: "studying",
                  progress: "0%",
                  startDate: date,
                }
              );
              await axios.put(`/api/courses/${courseId}/progress`, {
                status: "studying",
                progress:
                  (course.Module.map((item: { id: any }) => item.id).indexOf(
                    nextChapterId
                  ) /
                    course.Module.length) *
                    100 +
                  "%",
                startDate: date,
              });
            }

            //router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
          } else {
            await axios.put(`/api/courses/${courseId}/progress`, {
              status: "finished",
              progress: "100%",
              startDate: date,
            });
            confetti.onOpen();
            let currentUser = await axios.get(`/api/user`);
            await axios.patch(`/api/user/${currentUser.data.id}/score`, {
              star: parseInt(currentUser.data.star) + parseInt(course.credit),
              starUpdateDate: new Date(),
            });
            // router.push(`/search`);
          }
        }
        await axios.post(
          `/api/user/${currentUserId}/isInExam`,
          JSON.stringify({
            id: reportId,
            isInExam: false,
            note: "Finished Exam.",
            moduleId: chapter.id,
            courseId,
            date: new Date(),
            examRecord: {
              questionList: questions,
              timeLimit: parseInt(timeLimitRecord / 60 + "").toFixed(2),
              currentQuestion: currentQuestion,
              selectedAnswers: selectedAnswers,
              currentAttempt: currentAttempt,
            },
          })
        );
      }

      setOnFinish(true);
      setQuestions([]);
      let currentUser = await axios.get(`/api/user`);
      // await axios.patch(
      //   `/api/user/${currentUser.data.id}/examRecord/${chapter.id}`,
      //   examRecord
      // );
      if (totalScore >= chapter.scoreLimit) {
        if (nextChapterId != null) {
          setTimeout(function () {
            // function code goes here
          }, 10000);
          router.push(`/`);
          router.refresh();
        }
      }

      await axios.patch(`/api/user/${currentUser.data.id}/isInExam`, {
        id: reportId,
        values: {
          isInExam: false,
          moduleId: chapter.id,
          courseId,
        },
      });
    }

    router.refresh();
  };
  const setBookmark = (index: any) => {
    let newArr = [...questions];
    if ("bookmark" in newArr[index] && newArr[index]["bookmark"] == true) {
      newArr[index]["bookmark"] = false;
    } else {
      newArr[index]["bookmark"] = true;
    }

    setQuestions(newArr);
  };
  // Hàm xử lý khi người dùng chọn nút "Previous"
  const handlePreviousClick = () => {
    // Chuyển về câu hỏi trước đó
    const previousQuestion = currentQuestion - 1;
    if (previousQuestion >= 0) {
      setCurrentQuestion(previousQuestion);
    }
  };

  // Hàm tính điểm số dựa trên câu trả lời đã chọn
  const calculateScore = () => {
    let finalScore = 0;
    let newCategoryList = [...categoryList];
    if (selectedAnswers.length < 1) {
      return finalScore;
    }

    let myScore: number = 0;
    for (let i = 0; i < selectedAnswers.length; i++) {
      let categoryIndex = newCategoryList
        .map((item: { id: any }) => item.id)
        .indexOf(selectedAnswers[i].categoryId);
      newCategoryList[categoryIndex]["categoryScore"] = isNaN(
        parseInt(newCategoryList[categoryIndex]["categoryScore"])
      )
        ? 0
        : parseInt(newCategoryList[categoryIndex]["categoryScore"]);
      if (selectedAnswers[i].type == "singleChoice") {
        if (selectedAnswers[i].chooseAnswer[0].isCorrect == true) {
          selectedAnswers[i]["isRight"] = true;
          myScore = myScore + parseInt(selectedAnswers[i].score);
          newCategoryList[categoryIndex]["categoryScore"] = isNaN(
            parseInt(newCategoryList[categoryIndex]["categoryScore"])
          )
            ? 0
            : parseInt(newCategoryList[categoryIndex]["categoryScore"]) +
              parseInt(selectedAnswers[i].score);
        } else {
          selectedAnswers[i]["isRight"] = false;
        }
      } else {
        let correctSelectedAnswer = 0;
        let numberOfCorrectAnswer = selectedAnswers[i].answer.filter(
          (item: any) => item.isCorrect == true
        ).length;
        for (let k = 0; k < selectedAnswers[i].answer.length; k++) {
          if (
            selectedAnswers[i].answer[k].isCorrect == true &&
            selectedAnswers[i]?.chooseAnswer.includes(
              selectedAnswers[i].answer[k]
            )
          ) {
            correctSelectedAnswer++;
          }
        }
        if (
          selectedAnswers[i]?.chooseAnswer.length == correctSelectedAnswer &&
          correctSelectedAnswer == numberOfCorrectAnswer
        ) {
          selectedAnswers[i]["isRight"] = true;
          myScore = myScore + parseInt(selectedAnswers[i].score);
          newCategoryList[categoryIndex]["categoryScore"] = isNaN(
            parseInt(newCategoryList[categoryIndex]["categoryScore"])
          )
            ? 0
            : parseInt(newCategoryList[categoryIndex]["categoryScore"]) +
              parseInt(selectedAnswers[i].score);
        } else {
          selectedAnswers[i]["isRight"] = false;
        }
      }
    }

    // setCategoryList([...newCategoryList]);
    let maxScore = 100;

    finalScore = Math.floor((myScore / maxScore) * 100);
    setFinalScore(finalScore);
    setExamMaxSocre(maxScore);
    return { finalScore };
  };
  const onLeaving = () => {
    setOnFinish(false);
    if (nextChapterId != null) {
      router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    } else {
      router.push(`/`);
    }
    router.refresh();
  };
  const checkEqual = (array1: any, array2: any) => {
    for (let i = 0; i < array2.length; i++) {
      if (
        !array2[i].isCorrect &&
        array1.map((item: { id: any }) => item.id).indexOf(array2[i].id) != -1
      ) {
        return false;
      }
      if (
        array2[i].isCorrect &&
        array1.map((item: { id: any }) => item.id).indexOf(array2[i].id) == -1
      ) {
        return false;
      }
    }
    return true;
  };

  return questions.length == 0 ? (
    <>
      <div className="max-w-6xl mx-auto p-6 mt-5">
        <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Exam</h2>
          <p className="text-lg mb-4">
            Before you begin, please take a moment to review the following
            information about the exam.
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2">
              This exam consists of multiple-choice questions.
            </li>
            {isCompleted == "finished" ? (
              <></>
            ) : (
              <li className="mb-2">
                You will have{" "}
                <span className="text-red-600">
                  {chapter.maxAttempt - currentAttempt} times
                </span>{" "}
                to do the exam.
              </li>
            )}

            <li className="mb-2">
              You will have{" "}
              <span className="text-red-600">{chapter.timeLimit} minutes</span>{" "}
              to complete the exam.
            </li>
            <li className="mb-2">
              You need atleast{" "}
              <span className="text-red-600">{chapter.scoreLimit}%</span> to
              pass the exam.
            </li>
            <li className="mb-2">
              Make sure you are in a quiet environment to avoid distractions.
            </li>
          </ul>
          <AlertDialog open={onFinish}>
            <AlertDialogContent className="AlertDialogContent">
              <AlertDialogTitle className="AlertDialogTitle">
                <div className="bg-red-400 text-white p-4 rounded-t-lg">
                  <h2 className="text-xl font-semibold">
                    Your score is {finalScore}
                  </h2>
                </div>

                <div className="p-4">
                  <p className="text-lg mb-4">
                    {finalScore >= chapter.scoreLimit || finishedExam
                      ? nextChapterId != null
                        ? "Congratulation on finishing this exam."
                        : "Would you like to find another course?"
                      : "Sorry you have failed"}
                  </p>
                  {finalScore >= chapter.scoreLimit || finishedExam ? (
                    <div className="flex justify-center mt-4">
                      <Image
                        src="/congratulationLPC.svg"
                        alt="congratulation"
                        height={300}
                        width={500}
                        className="select-none object-cover rounded-md border-2 border-white shadow-md"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </AlertDialogTitle>
              <AlertDialogDescription className="AlertDialogDescription"></AlertDialogDescription>
              <div className="flex justify-between">
                {finalScore >= chapter.scoreLimit || finishedExam ? (
                  <AlertDialogCancel onClick={() => setOnFinish(false)}>
                    Stay
                  </AlertDialogCancel>
                ) : isCompleted == "failed" ? (
                  <span className="text-red-500">
                    Sorry, please wait for the exam reset to retake this test.
                  </span>
                ) : (
                  <AlertDialogCancel
                    onClick={() => accept()}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                  >
                    Retake
                  </AlertDialogCancel>
                )}
                {isCompleted == "failed" ? (
                  <AlertDialogCancel
                    onClick={() => setOnFinish(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    Close
                  </AlertDialogCancel>
                ) : (
                  <></>
                )}
                {finalScore >= chapter.scoreLimit || finishedExam ? (
                  <AlertDialogAction asChild>
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-lg"
                      onClick={() => onLeaving()}
                    >
                      {nextChapterId != null ? "Next" : "Leave"}
                    </button>
                  </AlertDialogAction>
                ) : (
                  <></>
                )}
              </div>
            </AlertDialogContent>
          </AlertDialog>
          <div className="mt-6">
            <p className="text-lg mb-4">Include:</p>
            <ul className="list-disc pl-5">
              {chapter.Category.map((item: any) => {
                return (
                  <li key={item.id} className="mb-2">
                    {item.title}:{" "}
                    {Math.floor(
                      (parseInt(item.numOfAppearance) /
                        parseInt(
                          chapter.Category.reduce(
                            (n: number, { numOfAppearance }: any) =>
                              n + numOfAppearance,
                            0
                          )
                        )) *
                        100
                    )}
                    %
                  </li>
                );
              })}
            </ul>
          </div>
          <AlertDialog>
            <div className="font-bold ml-2 rounded-lg">
              {isGeneratingExam ? (
                <div className="">
                  Please wait while we generate your exam...
                </div>
              ) : isCompleted == "failed" ? (
                <></>
              ) : (
                <AlertDialogTrigger className="flex justify-center items-center">
                  <>👉Take an exam </>
                </AlertDialogTrigger>
              )}
              {isCompleted == "failed" ? (
                <span className="text-red-500">
                  Sorry, please wait for the exam reset to retake this test
                </span>
              ) : (
                <></>
              )}
            </div>
            <AlertDialogContent className="AlertDialogContent">
              <AlertDialogTitle className="AlertDialogTitle">
                Exam note
              </AlertDialogTitle>
              <AlertDialogDescription className="AlertDialogDescription">
                {!finishedExam && isCompleted == "studying" ? (
                  <>Do you want to do the exam?</>
                ) : isCompleted == "failed" ? (
                  <>Please wait until admin reset</>
                ) : (
                  <>Do you want to retake this exam?</>
                )}
              </AlertDialogDescription>
              <div
                style={{
                  display: "flex",
                  gap: 25,
                  justifyContent: "flex-end",
                }}
              >
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  {isCompleted == "failed" ? (
                    <></>
                  ) : (
                    <button className="Button red" onClick={() => accept()}>
                      Yes
                    </button>
                  )}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
          <h2 className="text-2xl font-bold mb-6">Exam Score</h2>
          <div className="mb-6">
            <DoughnutChart score={finalScore} maxScore={examMaxScore} />
          </div>
          {finishedExam ? (
            <div>
              <p className="text-lg mb-2">
                You finished the exam. Retakes will not count.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-2">Your current score. Keep going!</p>
            </div>
          )}
        </div>
      </div>
      <AlertDialog>
        {exemRecord.length > 0 ? (
          <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 dark:bg-slate-600">
              <h2 className="text-2xl font-bold mb-6">History Exam</h2>
              <p className="text-lg mb-6">
                You have taken this test for: {exemRecord.length} times
              </p>
              <div className="space-y-6">
                {exemRecord[0]?.examRecord?.questionList?.map((item: any) => {
                  const isCorrect = checkEqual(item.chooseAnswer, item.answer);
                  return (
                    <div
                      className={`p-4 rounded-lg ${
                        isCorrect ? "bg-green-100" : "bg-red-100"
                      }`}
                      key={item.id}
                    >
                      <h3
                        className={`text-base font-semibold ${
                          isCorrect ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {item.question}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>No record found</>
        )}
      </AlertDialog>
    </>
  ) : (
    <main className="min-h-full items-center">
      {/* <br />
      <label className="block text-3xl font-bold mb-2 text-center">Exam</label> */}
      <div className="flex">
        <div className="w-3/4 p-8 ">
          <div className=" p-6 shadow-md rounded-md border border-blue-500">
            {/* <div className="flex justify-end mb-4">
            <Timer />
            {""} {time}
          </div> */}
            <div className="flex flex-col">
              <div className="flex flex-row items-center my-2.5">
                <span>
                  {currentQuestion + 1} of {questions.length} questions
                </span>
                <Countdown time={timeLimit}></Countdown>
              </div>

              <hr className="my-3" />
              <p className="text-2xl font-bold mb-4 flex items-center">
                {currentQuestion +
                  1 +
                  ". " +
                  questions[currentQuestion].question}{" "}
                {questions[currentQuestion].type == "multiChoice"
                  ? "(Multiple choices)"
                  : ""}
                <div className="ml-auto">
                  <BookmarkCheck
                    className={`${
                      questions[currentQuestion]?.bookmark == true
                        ? "bg-yellow-400"
                        : ""
                    }`}
                    cursor={"pointer"}
                    onClick={() => setBookmark(currentQuestion)}
                  />
                </div>
              </p>
              <ul>
                {questions[currentQuestion].answer.map(
                  (option: any, index: any) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleAnswerClick(questions[currentQuestion], option)
                      }
                      className={`cursor-pointer py-2 px-4 mb-2 border ${
                        selectedAnswers[currentQuestion] != undefined &&
                        selectedAnswers[currentQuestion]?.chooseAnswer
                          .map((item: { id: any }) => item.id)
                          .indexOf(option.id) != -1
                          ? "border-blue-600 text-white dark:text-white bg-blue-600"
                          : "border-gray-300 text-black dark:text-white"
                      } rounded-md hover:border-blue-600 hover:bg-blue-600 hover:text-white`}
                    >
                      {(index + 10).toString(36).toUpperCase() +
                        ". " +
                        option.text}
                    </li>
                  )
                )}
              </ul>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousClick}
                  className={`py-2 px-4 bg-gray-500 text-white rounded-md ${
                    currentQuestion === 0 ? "hidden" : "" // Ẩn nút "Previous" khi ở câu đầu tiên
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextClick}
                  className={`py-2 px-4 bg-green-500 text-white rounded-md ml-auto${
                    currentQuestion === questions.length - 1 ? "hidden" : "" // Ẩn nút "Next" khi ở câu cuối cùng
                  }`}
                >
                  {currentQuestion + 1 < questions.length ? "Next" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/4 p-8">
          <div className=" shadow-md rounded-md border border-blue-500">
            <div className="p-4 flex flex-wrap">
              {questions.map((item: any, index: any) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-9 h-9 flex items-center justify-center text-white rounded-full transition-colors duration-150 focus:outline-none mb-4 mx-1
                  ${
                    item?.bookmark
                      ? "bg-yellow-400"
                      : item?.chooseAnswer?.length > 0 && "chooseAnswer" in item
                      ? "bg-green-600"
                      : ""
                  }
                    ${
                      currentQuestion == index ? "bg-blue-700" : "bg-gray-500"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gray-500 mr-2"></div>
              <strong>: Not answered</strong>{" "}
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-green-600 mr-2"></div>
              <strong>: Answered</strong>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-yellow-400 mr-2"></div>
              <strong>: Bookmarks</strong>
            </div>
            <div className="flex items-center mt-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 mr-2"></div>
              <strong>: Selected</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Exam;
