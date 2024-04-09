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
import { redirect, useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import shuffleArray from "@/lib/shuffle";
import DoughnutChart from "@/components/ui/doughnut-chart";
const Exam = ({
  chapter,
  nextChapterId,
  courseId,
  course,
  isCompleted,
}: any) => {
  const [maxAsset, setMaxAsset] = useState(chapter.maxAsset);
  const [categoryList, setCategoryList]: any = useState([...chapter.Category]);
  const [finishedExam, setFinishedExam] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLimit, setTimeLimit]: any = useState(chapter.timeLimit);
  const [questions, setQuestions]: any = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examMaxScore, setExamMaxSocre] = useState(0);
  const [selectedAnswers, setSelectedAnswers]: Array<any> = useState([]);
  const confetti = useConfettiStore();

  useEffect(() => {
    const getHistory = async () => {
      let getLatestTestResult: any = await axios.get(
        `/api/courses/${courseId}/chapters/${chapter.id}/category/exam`
      );
      if (getLatestTestResult.data?.UserProgress[0]?.status == "finished") {
      } else {
        setMaxAsset(
          maxAsset - getLatestTestResult.data?.UserProgress[0]?.attempt
        );
      }

      setFinishedExam(
        getLatestTestResult.data?.UserProgress[0]?.status == "finished"
          ? true
          : false
      );
      setFinalScore(getLatestTestResult.data?.UserProgress[0]?.score);
      setCategoryList(getLatestTestResult.data?.Category);
      // console.log(shuffleArray(getLatestTestResult.data?.ExamList));
    };
    getHistory();
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
  const alertUser = (e: any) => {
    if (finishedExam || questions.length == 0) {
    } else {
      e.preventDefault();
      e.returnValue = "";
    }
  };
  const onTimeOut: any = async () => {
    if (questions.length == 0) {
    } else {
      const { finalScore }: any = calculateScore();
      const totalScore = finalScore;
      alert(
        `Kết thúc bài kiểm tra! Điểm của bạn là ${finalScore}%\n` +
          `${
            totalScore >= chapter.scoreLimit
              ? "Chúc mừng bạn đã pass"
              : "Bạn đã không vượt qua bài test"
          }`
      );
      if (!finishedExam) {
        setMaxAsset(maxAsset - 1);
        const date = new Date().toISOString();
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
          {
            status: totalScore >= chapter.scoreLimit ? "finished" : "failed",
            score: parseInt(finalScore),
            progress: "100%",
            endDate: date,
          }
        );
        if (totalScore >= chapter.scoreLimit) {
          if (totalScore > chapter.scoreLimit) {
            // let currentUser = await axios.get(`/api/user`);
            // switch (chapter.scoreLimit) {
            //   case 60:
            //     await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            //       star:
            //         parseInt(currentUser.data.star) +
            //         Math.floor(totalScore - chapter.scoreLimit) / 4,
            //     });
            //     break;
            //   case 70:
            //     await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            //       star:
            //         parseInt(currentUser.data.star) +
            //         Math.floor(totalScore - chapter.scoreLimit) / 3,
            //     });
            //     break;
            //   case 80:
            //     await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            //       star:
            //         parseInt(currentUser.data.star) +
            //         Math.floor(totalScore - chapter.scoreLimit) / 2,
            //     });
            //     break;
            //   case 90:
            //     await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            //       star:
            //         parseInt(currentUser.data.star) +
            //         Math.floor(totalScore - chapter.scoreLimit),
            //     });
            //     break;
            //   case 100:
            //     await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            //       star: parseInt(currentUser.data.star) + totalScore,
            //     });
            //     break;
            //   default:
            //     break;
            // }
          }

          if (nextChapterId != null) {
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
            });
          }
        }
      }
      setFinishedExam(true);
      setQuestions([]);
    }
  };

  // Danh sách câu hỏi và đáp án

  // useEffect(() => {
  //   async function loadQuestion() {}
  //   loadQuestion();
  // }, []);
  const accept = async () => {
    if (maxAsset == 0) {
      alert(
        `Sorry but you have no asset left! please wait for ${
          chapter.waitTime
        } day${chapter.waitTime > 1 ? "s" : ""} to get a reset!`
      );
    } else {
      setFinalScore(0);
      setFinishedExam(false);
      setTimeLimit(chapter.timeLimit);
      setCurrentQuestion(0);
      setSelectedAnswers([]);
      if (!finishedExam) {
        let getLatestTestResult: any = await axios.get(
          `/api/courses/${courseId}/chapters/${chapter.id}/category/exam`
        );
        setFinishedExam(
          getLatestTestResult.data?.UserProgress[0]?.status == "finished"
            ? true
            : false
        );
        let questionList = await axios.get(
          `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam/shuffle`
        );

        setQuestions(shuffleArray(questionList.data.ExamList));
      } else {
        let questionList = await axios.get(
          `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam/shuffle`
        );

        setQuestions(shuffleArray(questionList.data.ExamList));
      }
    }
  };
  // const cancel = () => {
  //   return redirect(`/courses`);
  // };
  // State để theo dõi câu hỏi hiện tại, điểm số và đáp án đã chọn cho từng câu hỏi

  // Hàm xử lý khi người dùng chọn một đáp án
  const handleAnswerClick = (question: any, option: any) => {
    if (
      "chooseAnswer" in question &&
      question["chooseAnswer"].includes(option)
    ) {
      let indexOf = question["chooseAnswer"].indexOf(option);
      question["chooseAnswer"].splice(indexOf, 1);
    } else {
      // Lưu câu trả lời đã chọn vào state
      if (question.type == "singleChoice") {
        const updatedAnswers = [...selectedAnswers];
        question["chooseAnswer"] = [];
        question["chooseAnswer"] = [...question["chooseAnswer"], option];
        updatedAnswers[currentQuestion] = question;
        setSelectedAnswers(updatedAnswers);
      } else {
        const updatedAnswers = [...selectedAnswers];
        // question["chosedAnswer"] = [];
        if (!("chooseAnswer" in question)) {
          question["chooseAnswer"] = [];
        }
        question["chooseAnswer"] = [...question["chooseAnswer"], option];
        updatedAnswers[currentQuestion] = question;

        setSelectedAnswers(updatedAnswers);
      }
    }
  };

  // Hàm xử lý khi người dùng chọn nút "Next"
  const handleNextClick = async () => {
    // Chuyển sang câu hỏi tiếp theo
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      // Nếu đã là câu hỏi cuối cùng, kiểm tra điểm số và hiển thị kết quả
      const { finalScore }: any = calculateScore();
      const totalScore = finalScore;
      alert(
        `Kết thúc bài kiểm tra! Điểm của bạn là ${finalScore}\n` +
          `${
            totalScore >= chapter.scoreLimit
              ? "Chúc mừng bạn đã pass"
              : "Bạn đã không vượt qua bài test"
          }`
      );

      if (!finishedExam) {
        setMaxAsset(maxAsset - 1);
        const date = new Date().toISOString();

        await axios.put(
          `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
          {
            status: totalScore >= chapter.scoreLimit ? "finished" : "failed",
            score: parseInt(finalScore),
            progress: "100%",
            endDate: date,
          }
        );
        if (totalScore >= chapter.scoreLimit) {
          if (totalScore > chapter.scoreLimit) {
            // let currentUser = await axios.get(`/api/user`);
            // switch (chapter.scoreLimit) {
            //   case 60:
            //     await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            //       star:
            //         parseInt(currentUser.data.star) +
            //         Math.floor(totalScore - chapter.scoreLimit) / 4,
            //     });
            //     break;
            //   case 70:
            //     await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            //       star:
            //         parseInt(currentUser.data.star) +
            //         Math.floor(totalScore - chapter.scoreLimit) / 3,
            //     });
            //     break;
            //   case 80:
            //     await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            //       star:
            //         parseInt(currentUser.data.star) +
            //         Math.floor(totalScore - chapter.scoreLimit) / 2,
            //     });
            //     break;
            //   case 90:
            //     await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            //       star:
            //         parseInt(currentUser.data.star) +
            //         Math.floor(totalScore - chapter.scoreLimit),
            //     });
            //     break;
            //   case 100:
            //     await axios.patch(`/api/user/${currentUser.data.id}/score`, {
            //       star: parseInt(currentUser.data.star) + totalScore,
            //     });
            //     break;
            //   default:
            //     break;
            // }
          }
          if (nextChapterId != null) {
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
                  (course.Module.length - 1)) *
                  100 +
                "%",
              startDate: date,
            });

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
            });
            // router.push(`/search`);
          }
        }
      }
      setFinishedExam(true);
      setQuestions([]);
    }
  };
  const setBookmark = (item: any) => {
    if ("bookmark" in item && item["bookmark"] == true) {
      item["bookmark"] = false;
    } else {
      item["bookmark"] = true;
    }
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
          myScore = myScore + parseInt(selectedAnswers[i].score);
          newCategoryList[categoryIndex]["categoryScore"] = isNaN(
            parseInt(newCategoryList[categoryIndex]["categoryScore"])
          )
            ? 0
            : parseInt(newCategoryList[categoryIndex]["categoryScore"]) +
              parseInt(selectedAnswers[i].score);
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
          myScore = myScore + parseInt(selectedAnswers[i].score);
          newCategoryList[categoryIndex]["categoryScore"] = isNaN(
            parseInt(newCategoryList[categoryIndex]["categoryScore"])
          )
            ? 0
            : parseInt(newCategoryList[categoryIndex]["categoryScore"]) +
              parseInt(selectedAnswers[i].score);
        }
      }
    }

    // setCategoryList([...newCategoryList]);
    let maxScore = questions.reduce(
      (n: number, { score }: any) => n + score,
      0
    );

    finalScore = Math.floor((myScore / maxScore) * 100);
    setFinalScore(finalScore);
    setExamMaxSocre(maxScore);
    return { finalScore };
  };

  return questions.length == 0 ? (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Exam</h1>
        <p className="text-lg mb-4">
          Before you begin, please take a moment to review the following
          information about the exam.
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">
            This exam consists of multiple-choice questions.
          </li>
          <li className="mb-2">
            You will have a limited time to complete the exam.
          </li>
          <li className="mb-2">
            Make sure you are in a quiet environment to avoid distractions .
          </li>
        </ul>
        <div>
          <p className="text-lg mb-4">Include:</p>
          <ul className="list-disc pl-5 mb-4">
            {chapter.Category.map((item: any) => {
              return (
                <li>
                  {item.title}:
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
      </div>
      {finishedExam ? (
        <>
          You have finished this exam, you can retake it but your score will not
          count.
          <DoughnutChart
            score={finalScore}
            maxScore={examMaxScore}
          ></DoughnutChart>
        </>
      ) : (
        <DoughnutChart
          score={finalScore}
          maxScore={examMaxScore}
        ></DoughnutChart>
      )}
      <AlertDialog>
        <AlertDialogTrigger className="flex justify-center items-center">
          <div className="font-bold ml-2 rounded-lg">👉Take an exam</div>
        </AlertDialogTrigger>

        <AlertDialogContent className="AlertDialogContent">
          <AlertDialogTitle className="AlertDialogTitle">
            Exam note
          </AlertDialogTitle>
          <AlertDialogDescription className="AlertDialogDescription">
            {finishedExam ? (
              <>Do you want to retake this exam?</>
            ) : (
              <>
                Do you want to do the exam? You have{" "}
                {maxAsset > 5 ? "Infinite" : maxAsset} time to do this test
              </>
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
              <button className="Button red" onClick={() => accept()}>
                Yes
              </button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
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
                <Countdown time={timeLimit} callback={onTimeOut}></Countdown>
              </div>

              <hr className="my-3" />
              <p className="text-2xl font-bold mb-4 flex items-center">
                {currentQuestion +
                  1 +
                  ". " +
                  questions[currentQuestion].question}
                <div className="ml-auto">
                  <BookmarkCheck
                    className={`${
                      questions[currentQuestion]?.bookmark == true
                        ? "bg-yellow-400"
                        : ""
                    }`}
                    cursor={"pointer"}
                    onClick={() => setBookmark(questions[currentQuestion])}
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
                        selectedAnswers[currentQuestion]?.chooseAnswer.includes(
                          option
                        )
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
                      : "bg-gray-500"
                  }
                    ${currentQuestion === index ? "bg-blue-700" : ""}`}
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
