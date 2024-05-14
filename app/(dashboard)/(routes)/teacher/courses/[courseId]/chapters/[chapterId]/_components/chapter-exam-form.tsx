"use client";
import {
  PlusCircle,
  Upload,
  Trash2,
  X,
  Save,
  ArrowLeft,
  Asterisk,
} from "lucide-react";
import axios from "axios";

import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
const Link = dynamic(() => import("next/link"), {
  ssr: false,
});
export default function Exam({ chapter }: any) {
  const [quizList, setQuizList]: any = useState<
    Array<{
      id: number;
      title: string;
      numOfAppearance: number;

      question: Array<{
        id: number;
        question: string;
        type: string;
        score: number;
        answer: Array<{
          id: number;
          text: string;
          isCorrect: boolean;
        }>;
      }>;
    }>
  >([]);
  const [textTitle, setTextTitle] = useState(chapter.title);
  const [timeLimit, setTimeLimit]: any = useState(60);
  const [passPercentage, setPassPercentage] = useState(80);

  useEffect(() => {
    async function loadQuestion() {
      let questionList = await axios.get(
        `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam`
      );

      setQuizList(questionList.data.Category);
      setPassPercentage(chapter.scoreLimit == null ? 80 : chapter.timeLimit);

      setTimeLimit(chapter.timeLimit == null ? 60 : chapter.timeLimit);
    }
    loadQuestion();
  }, []);
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  function addCategory() {
    const newCategory: any = {
      id: getRandomInt(100000).toString(),
      title: "",
      numOfAppearance: 0,
      question: [],
    };
    setQuizList([...quizList, newCategory]);
  }
  function removeCategory(index: number) {
    const newQuizsList = [...quizList];
    newQuizsList.splice(index, 1);
    setQuizList([...newQuizsList]);
  }
  function numOfAppearanceOnChange(number: number, index: number) {
    const newQuizsList = [...quizList];
    if (isNaN(number)) {
      alert("The number of appeared questions must be number.");
      newQuizsList[index].numOfAppearance = parseInt(
        newQuizsList[index].question.length
      );
      setQuizList([...newQuizsList]);
      return;
    }
    if (newQuizsList[index].question.length < number) {
      alert(
        "The number of appeared questions cannot exceeded the number of questions in the category."
      );
      newQuizsList[index].numOfAppearance = parseInt(
        newQuizsList[index].question.length
      );
      setQuizList([...newQuizsList]);
      return;
    }
    newQuizsList[index].numOfAppearance = number;
    setQuizList([...newQuizsList]);
  }
  function addQuiz(index: number) {
    const newQuizsList: any = [...quizList];
    const newQuiz: any = {
      id: getRandomInt(100000).toString(),
      question: "",
      type: "singleChoice",
      answer: [
        {
          id: getRandomInt(100000).toString(),
          text: "",
          isCorrect: false,
        },
      ],
    };
    newQuizsList[index].question = [...newQuizsList[index].question, newQuiz];
    setQuizList([...quizList, newQuiz]);
  }
  function removeQuestion(jindex: number, index: number) {
    const newQuizsList = [...quizList];
    newQuizsList[index].question.splice(jindex, 1);
    setQuizList([...newQuizsList]);
  }
  function addAnswer(index: number, jindex: number) {
    const newQuizsList: any = [...quizList];
    const newAnswer: any = {
      examId: getRandomInt(100000),
      text: "",
      isCorrect: false,
    };
    newQuizsList[index].question[jindex].answer = [
      ...newQuizsList[index].question[jindex].answer,
      newAnswer,
    ];
    setQuizList([...newQuizsList]);
  }

  function removeAnswer(index: number, jindex: number, kindex: number) {
    const newQuizsList = [...quizList];
    newQuizsList[index].question[jindex].answer.splice(kindex, 1);
    setQuizList([...newQuizsList]);
  }

  function categoryOnChangeText(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    e.preventDefault();
    const newQuizsList = [...quizList];
    newQuizsList[index].title = e.target.value;
    setQuizList([...newQuizsList]);
  }
  function questionOnChangeText(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    jindex: number
  ) {
    e.preventDefault();
    const newQuizsList = [...quizList];
    newQuizsList[index].question[jindex].question = e.target.value;
    setQuizList([...newQuizsList]);
  }
  function categoryOnScoreChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    e.preventDefault();
    const newQuizsList = [...quizList];
    if (
      parseInt(e.target.value) < 0 ||
      parseInt(e.target.value) > 5 ||
      isNaN(parseInt(e.target.value))
    ) {
      alert("Invalid score");
    }
    newQuizsList[index].score = e.target.value;
    setQuizList([...newQuizsList]);
  }
  function questionOnChangeType(
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
    jindex: number
  ) {
    e.preventDefault();
    const newQuizsList = [...quizList];
    newQuizsList[index].question[jindex].type = e.target.value;
    setQuizList([...newQuizsList]);
  }

  function answerOnChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    jindex: number,
    kindex: number
  ) {
    const newQuizsList = [...quizList];
    newQuizsList[index].question[jindex].answer[kindex].text = e.target.value;
    setQuizList([...newQuizsList]);
  }
  function isCompulsory(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    jindex: number
  ) {
    const newQuizsList = [...quizList];
    newQuizsList[index].question[jindex].compulsory = e.target.checked;
    setQuizList([...newQuizsList]);
  }
  function correctAnswerOnChange(e: any, index: any, jindex: any, kindex: any) {
    const newQuizsList = [...quizList];
    if (newQuizsList[index].question[jindex].type === "singleChoice") {
      if (e.target.checked) {
        const checkExistAnswer = newQuizsList[index].question[jindex].answer
          .map((item: any) => item.isCorrect)
          .indexOf(true);

        if (checkExistAnswer !== -1) {
          alert("Sorry, only one correct answer for single choice question");
          return;
        }
      }
    }

    newQuizsList[index].question[jindex].answer[kindex].isCorrect =
      e.target.checked;

    setQuizList([...newQuizsList]);
  }
  const router = useRouter();
  async function submit() {
    if (quizList.length === 0) {
      alert("Please add some questions");
    } else {
      if (timeLimit == 0) {
        alert("Please set time for this exam");
        return;
      }
      const newQuizsList = [...quizList];
      for (let i = 0; i < newQuizsList.length; i++) {
        if (newQuizsList[i].question.length < 1) {
          alert("Sorry, each category must have at least one question");
          return;
        } else {
          for (let j = 0; j < newQuizsList[i].question.length; j++) {
            if (newQuizsList[i].question[j].answer.length < 2) {
              alert("Sorry, each question must have at least two answer");
              return;
            }
          }
        }
      }
      const checkAnswersList = newQuizsList.map((item) =>
        item.question.map((item: any) =>
          item.answer.map((item: any) => item.isCorrect).indexOf(true)
        )
      );
      for (let i = 0; i < checkAnswersList.length; i++) {
        if (checkAnswersList[i].indexOf(-1) !== -1) {
          alert("Sorry, all questions must have at least one correct answer");
          return;
        }
      }

      for (let i = 0; i < newQuizsList.length; i++) {
        for (let j = 0; j < newQuizsList[i].question.length; j++) {
          if (newQuizsList[i].question[j].type == "singleChoice") {
            const checkAnswersListType = newQuizsList[i].question[
              j
            ].answer.filter((item: any) => item.isCorrect == true);
            if (checkAnswersListType.length > 1) {
              alert(
                "Sorry, there can only be one correct answer in single choice question"
              );
              return;
            }
          }
        }
      }
    }
    if (textTitle != chapter.title) {
      let values = {
        title: textTitle,
      };
      await axios.patch(
        `/api/courses/${chapter?.courseId}/chapters/${chapter?.id}`,
        values
      );
    }
    let values = {
      timeLimit: parseFloat(timeLimit),
      scoreLimit: passPercentage,
    };
    await axios.patch(
      `/api/courses/${chapter?.courseId}/chapters/${chapter?.id}`,
      values
    );
    await axios.post(
      `/api/courses/${chapter?.courseId}/chapters/${chapter?.id}/category/exam`,
      quizList
    );
    toast.success("Exam updated");
    router.push(
      `/teacher/courses/${chapter?.courseId}/chapters/${chapter?.id}`
    );
    router.refresh();
    let questionList = await axios.get(
      `/api/courses/${chapter.courseId}/chapters/${chapter.id}/category/exam`
    );

    setQuizList(questionList.data.Category);
  }

  const fileRef: any = useRef();

  //check valid excel file
  const isExcelFile = (file: { name: any }) => {
    const allowedExtensions = [".xlsx", ".xls"];
    const fileName = file.name;
    const fileExtension = fileName
      .slice(fileName.lastIndexOf("."))
      .toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };
  const handleFile = (e: { target: any }, index: number) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isExcelFile(file) && file.size != 0) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e: any) => {
        const data1 = e.target.result;
        const workbook = XLSX.read(data1, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData: any = XLSX.utils.sheet_to_json(sheet, {
          raw: true,
          header: ["question", "Answer", "Type", "score", "compulsory"],
        });
        let returnArr: any = [];
        for (let i = 0; i < parsedData.length; i++) {
          const newQuiz: any = {
            id: getRandomInt(100000),
            question: parsedData[i].question,
            type:
              parsedData[i].Type == "single choice"
                ? "singleChoice"
                : "multiChoice",
            answer: customSplit(parsedData[i].Answer),
            score: parsedData[i].score,
            compulsory: parsedData[i].compulsory,
          };
          returnArr = [...returnArr, newQuiz];
        }
        setQuizList([...quizList[index].question, ...returnArr]);

        // setData(parsedData);
      };
      // setFileName(file.name);
    } else {
      alert("Invalid file format");
    }
  };
  const handleFileFull = (e: { target: any }) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isExcelFile(file) && file.size != 0) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e: any) => {
        const data1 = e.target.result;
        const workbook = XLSX.read(data1, { type: "binary" });
        let readData: any = [];
        for (let k = 0; k < workbook.SheetNames.length; k++) {
          const sheetName = workbook.SheetNames[k];
          const sheet = workbook.Sheets[sheetName];
          const parsedData: any = XLSX.utils.sheet_to_json(sheet, {
            raw: true,
            header: ["question", "Answer", "Type", "score", "compulsory"],
          });
          let category: any = {
            id: getRandomInt(100000).toString(),
            title: sheetName.split(".")[0],
            numOfAppearance: sheetName.split(".")[1],
            question: [],
          };

          for (let i = 0; i < parsedData.length; i++) {
            const newQuiz: any = {
              id: getRandomInt(100000),
              question: parsedData[i].question,
              type:
                parsedData[i].Type == "single choice"
                  ? "singleChoice"
                  : "multiChoice",
              answer: customSplit(parsedData[i].Answer),
              score: parsedData[i].score,
              compulsory: parsedData[i].compulsory,
            };
            category["question"] = [...category.question, newQuiz];
          }

          readData = [...readData, category];
        }

        setQuizList([...quizList, ...readData]);

        // setData(parsedData);
      };
      // setFileName(file.name);
    } else {
      alert("Invalid file format");
    }
  };
  const customSplit = (array: string) => {
    let newArray: any = array.split("/n");
    let returnArr: any = [];
    for (let i = 0; i < newArray.length; i++) {
      let newItem = {
        id: getRandomInt(100000),
        text: newArray[i]
          .toString()
          .replace(/^(\r\n\.)/, "")
          .replace("(T)", ""),
        isCorrect: newArray[i].includes("(T)") ? true : false,
      };
      returnArr = [...returnArr, newItem];
    }
    return returnArr;
  };

  return (
    <main className="min-h-full items-center" suppressHydrationWarning={true}>
      <div className="w-full p-8 " suppressHydrationWarning={true}>
        <div className="pb-3">
          <label className="block text-3xl font-bold mb-2 text-center">
            Create Exam
          </label>

          <label className="block text-lg mt-2">Click</label>
          <Link
            suppressHydrationWarning={true}
            download="Exam_Format_Category"
            href={`/Exam_Format_Category.xlsx`}
            target="_blank"
            className="text-blue-600 hover:underline cursor-pointer"
            contextMenu="Here"
          >
            here
          </Link>
          <label className="block text-lg mt-2">
            to download the category format.
          </label>
        </div>
        <div className="flex flex-row w-full">
          <div className="grow-0 mr-2 w-1/3">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="textTitle"
            >
              Enter exam title
            </label>
            <input
              type="text"
              id="textTitle"
              name="text_title"
              className="w-full px-4 py-2 border rounded focus:outline-none border-black"
              placeholder="Exam title"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
            />
          </div>

          <div className="grow-0 mr-2">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="passPercentage"
            >
              % to pass
            </label>
            <select
              className="px-4 py-2 border rounded focus:outline-none border-black "
              onChange={(e: any) => setPassPercentage(parseInt(e.target.value))}
              name={"passPercentage"}
              defaultValue={passPercentage}
            >
              <option value="70">70%</option>
              <option value="80">80%</option>
            </select>
          </div>

          <div className="grow-0 mr-2">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="examTime"
            >
              Enter exam time
            </label>

            <input
              type="text"
              id="examTime"
              name="exam_time"
              className="px-4 py-2 border rounded focus:outline-none border-black w-1/5"
              placeholder="e.g., 60"
              value={timeLimit}
              onChange={(e: any) => setTimeLimit(e.target.value)}
            />
            <span className="px-4">minutes</span>
          </div>
        </div>
        <span>
          <strong>Option 1:</strong>
        </span>
        <label className="block text-lg mb-2">Import exam here</label>
        <div className="flex items-center w-full">
          <label className="w-64 flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            <span>Choose File category</span>
            <input
              className="hidden"
              type="file"
              id="formFile"
              accept=".xlsx,.xls"
              onChange={(e) => {
                handleFileFull(e);
              }}
              ref={fileRef}
            />
          </label>
          <span className="ml-4 text-gray-500">
            (Accepted formats: .xlsx, .xls)
          </span>
        </div>
        <span>
          <strong>Option 2:</strong>
        </span>
        <label className="block text-lg mb-2">
          You can create a category here
        </label>
        <div className="flex">
          <button
            className="bg-black text-white px-4 py-2 rounded flex items-center"
            onClick={() => addCategory()}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Category
          </button>

          <button
            className="bg-black text-white px-4 py-2 rounded flex items-center ml-2"
            onClick={() => submit()}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
        </div>
        {quizList.map((category: any, index: any) => {
          return (
            <div
              key={category.id}
              className="my-4 p-4 border rounded  shadow-md relative"
            >
              <label className="block text-lg mt-2">Click</label>
              <Link
                suppressHydrationWarning={true}
                download="Exam_Format_Question"
                href={`/Exam_Format_Question.xlsx`}
                target="_blank"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                here
              </Link>
              <label className="block text-lg mt-2">
                to download the question format.
              </label>
              <button
                className="bg-gray-600 text-white p-2 rounded-full absolute top-2 right-2"
                onClick={() => removeCategory(index)}
              >
                <X className="h-4 w-4" />
              </button>
              <br />
              <textarea
                name={category.id + " name"}
                value={category.title}
                className="w-full p-2 border rounded focus:outline-none border-black"
                placeholder="Category title"
                onChange={(e: any) => categoryOnChangeText(e, index)}
              />
              <input
                type="text"
                id="numOfAppearance"
                name="text_numOfAppearance"
                className="w-full px-4 py-2 border rounded focus:outline-none border-black"
                placeholder="How many questions of this category will appear in the test ?"
                value={category.numOfAppearance}
                onChange={(e) =>
                  numOfAppearanceOnChange(parseInt(e.target.value), index)
                }
              />

              <span>
                <strong>Option 1:</strong>
              </span>
              <label className="block text-lg mb-2">Import question here</label>
              <div className="flex items-center w-full">
                <label className="w-64 flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  <span>Choose File</span>
                  <input
                    className="hidden"
                    type="file"
                    id="formFile"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFile(e, index)}
                    ref={fileRef}
                  />
                </label>
                <span className="ml-4 text-gray-500">
                  (Accepted formats: .xlsx, .xls)
                </span>
              </div>
              <span>
                <strong>Option 2:</strong>
              </span>
              <label className="block text-lg mb-2">
                You can create a question here
              </label>
              <button
                className="bg-black text-white px-4 py-2 rounded flex items-center"
                onClick={() => addQuiz(index)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Question
              </button>
              {category.question.map((quiz: any, jindex: any) => {
                return (
                  <div
                    key={quiz.id}
                    className="my-4 p-4 border rounded  shadow-md relative"
                  >
                    <button
                      className="bg-gray-600 text-white p-2 rounded-full absolute top-2 right-2"
                      onClick={() => removeQuestion(index, jindex)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <br />

                    <div className="flex flex-wrap -mx-2">
                      <div className="w-full md:w-5/6 px-2 mb-2">
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="textTitle"
                        >
                          Enter question
                        </label>
                        <textarea
                          name={quiz.id + " name"}
                          value={quiz.question}
                          className="w-full p-2 border rounded focus:outline-none border-black"
                          placeholder="Question title"
                          onChange={(e: any) =>
                            questionOnChangeText(e, index, jindex)
                          }
                        />
                      </div>
                      Question score
                      <input
                        type="text"
                        value={quiz.score}
                        onChange={(e) => categoryOnScoreChange(e, index)}
                        className="mx-2 visually-hidden-checkbox h-6 w-6"
                      />
                      <div className="w-full md:w-1/12 px-2 mb-2">
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="textTitle"
                        >
                          Type
                        </label>
                        <select
                          className="w-full p-2 border rounded focus:outline-none border-black"
                          defaultValue={quiz.type}
                          onChange={(e) =>
                            questionOnChangeType(e, index, jindex)
                          }
                          name={quiz.id + " type"}
                        >
                          <option value="singleChoice">Single choice</option>
                          <option value="multiChoice">Multiple choice</option>
                        </select>
                        <input
                          type="checkbox"
                          checked={quiz.compulsory}
                          name={`correct-answer-${jindex}`}
                          onChange={(e) => isCompulsory(e, index, jindex)}
                          className="mx-2 visually-hidden-checkbox h-6 w-6"
                        />
                        is compulsory in test?
                      </div>
                    </div>

                    {quiz.answer.map((answer: any, kindex: any) => (
                      <div key={answer.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={answer.isCorrect}
                          name={`correct-answer-${jindex}`}
                          onChange={(e) =>
                            correctAnswerOnChange(e, index, jindex, kindex)
                          }
                          className="mx-2 visually-hidden-checkbox h-6 w-6"
                        />
                        <label
                          htmlFor={answer.id}
                          className="text-sm text-green-500 checkbox-label h-6 w-6"
                        >
                          {answer.isCorrect && "✔"}
                        </label>

                        <textarea
                          name={answer.id}
                          className="w-3/6 mb-2 p-2 border rounded focus:outline-none border-black"
                          placeholder="Enter answer"
                          value={answer.text}
                          onChange={(e: any) =>
                            answerOnChange(e, index, jindex, kindex)
                          }
                        />

                        <button
                          className="bg-gray-600 text-white p-2 rounded-full flex items-center ml-2"
                          onClick={() => removeAnswer(index, jindex, kindex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                      onClick={() => addAnswer(index, jindex)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Answer
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </main>
  );
}
