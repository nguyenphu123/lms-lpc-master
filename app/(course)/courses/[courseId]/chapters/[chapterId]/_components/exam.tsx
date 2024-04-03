"use client";
import { countdown } from "@/hooks/use-countdown";
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
  const [categoryList, setCategoryList]: any = useState([]);
  const [finishedExam, setFinishedExam] = useState(false);
  const confetti = useConfettiStore();
  let [questions, setQuestions]: any = useState([]);
  useEffect(() => {
    const getHistory = async () => {
      let getLatestTestResult: any = await axios.get(
        `/api/courses/${courseId}/chapters/${chapter.id}/category/exam`
      );

      setMaxAsset(
        maxAsset - getLatestTestResult.data?.UserProgress[0]?.attempt
      );
      setFinishedExam(
        getLatestTestResult.data?.UserProgress[0]?.status == "finished"
          ? true
          : false
      );
      setCategoryList(getLatestTestResult.data?.Category);
      // console.log(shuffleArray(getLatestTestResult.data?.ExamList));
    };
    getHistory();
  }, []);

  const onTimeOut = async () => {
    if (questions.length == 0) {
    } else {
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
      if (chapter.status != "finished") {
        const year = new Date();
        const date = new Date(year.getFullYear(), 6, 1).toISOString();
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
          {
            status: totalScore >= chapter.scoreLimit ? "finished" : "failed",
            score: finalScore.toString(),
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
            setMaxAsset(maxAsset - 1);
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
  const time = countdown(chapter.timeLimit, onTimeOut);
  // Danh sách câu hỏi và đáp án

  // useEffect(() => {
  //   async function loadQuestion() {}
  //   loadQuestion();
  // }, []);
  const accept = async () => {
    if (chapter.status != "finished") {
      let questionList = await axios.get(
        `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam/shuffle`
      );

      setQuestions(shuffleArray(questionList.data.ExamList));
    } else {
      let getLatestTestResult: any = await axios.get(
        `/api/courses/${courseId}/chapters${chapter.id}/category/exam`
      );
      setMaxAsset(
        maxAsset - getLatestTestResult.data?.UserProgress[0]?.attempt
      );
      let questionList = await axios.get(
        `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam/shuffle`
      );

      setQuestions(shuffleArray(questionList.data.ExamList));
    }
  };
  const cancel = () => {
    return redirect(`/courses`);
  };
  // State để theo dõi câu hỏi hiện tại, điểm số và đáp án đã chọn cho từng câu hỏi
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswers, setSelectedAnswers]: Array<any> = useState([]);

  // Hàm xử lý khi người dùng chọn một đáp án
  const handleAnswerClick = (question: any, option: any) => {
    if (
      "chooseAnwser" in question &&
      question["chooseAnwser"].includes(option)
    ) {
      let indexOf = question["chooseAnwser"].indexOf(option);
      question["chooseAnwser"].splice(indexOf, 1);
    } else {
      // Lưu câu trả lời đã chọn vào state
      if (question.type == "singleChoice") {
        const updatedAnswers = [...selectedAnswers];
        question["chooseAnwser"] = [];
        question["chooseAnwser"] = [...question["chooseAnwser"], option];
        updatedAnswers[currentQuestion] = question;
        setSelectedAnswers(updatedAnswers);
      } else {
        const updatedAnswers = [...selectedAnswers];
        // question["chosedAnwser"] = [];
        if (!("chooseAnwser" in question)) {
          question["chooseAnwser"] = [];
        }
        question["chooseAnwser"] = [...question["chooseAnwser"], option];
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
      if (chapter.status != "finished") {
        const year = new Date();
        const date = new Date(year.getFullYear(), 6, 1).toISOString();
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
          {
            status: totalScore >= chapter.scoreLimit ? "finished" : "failed",
            score: finalScore.toString(),
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
            setMaxAsset(maxAsset - 1);
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

    if (selectedAnswers.length < 1) {
      return finalScore;
    }

    for (let i = 0; i < selectedAnswers.length; i++) {
      let categoryScore = 0;
      for (let j = 0; j < categoryList.length; j++) {
        if (selectedAnswers[i].type == "singleChoice") {
          if (selectedAnswers[i].chooseAnwser[0].isCorrect == true) {
            categoryScore = categoryScore + selectedAnswers[i].score;
          }
        } else {
          let correctSelectedAnwser = 0;
          let numberOfCorrectAnwser = selectedAnswers[i].anwser.filter(
            (item: any) => item.isCorrect == true
          ).length;
          for (let k = 0; k < selectedAnswers[i].anwser.length; k++) {
            if (
              selectedAnswers[i].anwser[k].isCorrect == true &&
              selectedAnswers[i]?.chooseAnwser.includes(
                selectedAnswers[i].anwser[k]
              )
            ) {
              correctSelectedAnwser++;
            }
          }
          if (
            selectedAnswers[i]?.chooseAnwser.length == correctSelectedAnwser &&
            correctSelectedAnwser == numberOfCorrectAnwser
          ) {
            categoryScore = categoryScore + selectedAnswers[i].score;
          }
        }
        categoryList[i]["categoryScore"] = categoryScore;
      }
    }
    let maxScore = categoryList.reduce(
      (n: number, { categoryMaxScore }: any) => n + categoryMaxScore,
      0
    );
    let yourScore = categoryList.reduce(
      (n: number, { categoryScore }: any) => n + categoryScore,
      0
    );
    finalScore = (yourScore / maxScore) * 100;
    return { finalScore };
  };

  return questions.length == 0 ? (
    <>
      <div className="bg-gray-100 p-6 rounded-lg dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Exam</h1>
        <p className="text-lg mb-4">
          Before you begin, please take a moment to review the following
          information about the exam.
        </p>
        <ul className="list-disc pl-5">
          <li className="mb-2">
            This exam consists of multiple-choice questions.
          </li>
          <li className="mb-2">
            You will have a limited time to complete the exam.
          </li>
          <li className="mb-2">
            Make sure you are in a quiet environment to avoid distractions.
          </li>
        </ul>
      </div>

      <AlertDialog>
        <AlertDialogTrigger className="flex justify-center items-center">
          <div className="font-bold ml-2 rounded-lg">👉Take an exam</div>
          {finishedExam ? (
            <>
              <DoughnutChart
                score={[
                  categoryList.reduce(
                    (n: number, { categoryMaxScore }: any) =>
                      n + categoryMaxScore,
                    0
                  ),
                  categoryList.reduce(
                    (n: number, { categoryScore }: any) => n + categoryScore,
                    0
                  ),
                ]}
              ></DoughnutChart>
              {categoryList.map((item: any, index: any) => {
                <div key={item.id}>
                  <DoughnutChart
                    score={[item.categoryMaxScore, item.categoryScore]}
                  ></DoughnutChart>
                </div>;
              })}
            </>
          ) : (
            <></>
          )}
        </AlertDialogTrigger>

        <AlertDialogContent className="AlertDialogContent">
          <AlertDialogTitle className="AlertDialogTitle">
            Exam note
          </AlertDialogTitle>
          <AlertDialogDescription className="AlertDialogDescription">
            Do you want to do the exam? You have{" "}
            {maxAsset > 5 ? "Infinite" : maxAsset} time to do this test
          </AlertDialogDescription>
          <div
            style={{
              display: "flex",
              gap: 25,
              justifyContent: "flex-end",
            }}
          >
            <AlertDialogCancel asChild>
              <button className="Button mauve" onClick={() => cancel()}>
                Cancel
              </button>
            </AlertDialogCancel>
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
                <div className="flex ml-auto rounded-full bg-blue-500 p-2 text-white">
                  <Timer />
                  <span className="mr-2"></span> {time}
                </div>
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
                {questions[currentQuestion].anwser.map(
                  (option: any, index: any) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleAnswerClick(questions[currentQuestion], option)
                      }
                      className={`cursor-pointer py-2 px-4 mb-2 border ${
                        selectedAnswers[currentQuestion]?.chooseAnwser.includes(
                          option
                        )
                          ? "border-blue-600 text-white dark:text-black"
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
                      : item?.chooseAnwser?.length > 0 && "chooseAnwser" in item
                      ? "bg-green-600"
                      : "bg-gray-500"
                  } `}
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default Exam;
