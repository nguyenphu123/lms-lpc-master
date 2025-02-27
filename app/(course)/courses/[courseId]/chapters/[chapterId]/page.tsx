// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import { getChapter } from "@/actions/get-chapter";
// import { getExam } from "@/actions/get-exam";
// import { Banner } from "@/components/banner";
// import { Preview } from "@/components/preview";
// import Exam from "./_components/exam";
// import Slide from "./_components/slide";
// import Link from "next/link";
// import { db } from "@/lib/db";
// import { AlertInExam } from "@/components/ui/alert-in-exam";

// const ChapterIdPage = async ({
//   params,
// }: {
//   params: { courseId: string; chapterId: string };
// }) => {
//   const { userId } = auth();

//   if (!userId) {
//     return redirect("/");
//   }

//   let userInfo: any = await db.user.findUnique({
//     where: { id: userId },
//     include: {
//       userExamReport: {},
//     },
//   });

//   const {
//     chapter,
//     course,
//     preChapter,
//     nextChapter,
//   }: any = await getChapter({
//     userId,
//     moduleId: params.chapterId,
//     courseId: params.courseId,
//   });

//   const { exam }: any = await getExam({
//     userId,
//     examId: params.chapterId,
//     courseId: params.courseId,
//   });

//   if (!chapter || !course) {
//     return redirect("/");
//   }
//   console.log("chapter abc:",chapter)
//   return chapter.type == "Exam" ? (
//     <>
//       <Exam
//         chapter={chapter.exam}
//         nextChapterId={nextChapter}
//         courseId={params.courseId}
//         course={course}
//       />
//     </>
//   ) : (userInfo.userExamReport[0]?.isInExam && chapter.type != "Exam") ||
//     (userInfo.userExamReport[0]?.isInExam &&
//       chapter.type == "Exam" &&
//       chapter.id != userInfo.userExamReport[0]?.moduleId) ? (
//     <AlertInExam
//       courseId={userInfo.userExamReport[0]?.courseId}
//       moduleId={userInfo.userExamReport[0]?.moduleId}
//     />
//   ) : (
//     <div className="pl-6 pt-3">
//       <div className="flex flex-col pb-20 overflow-x-hidden">
//         <div>
//           <Slide
//             slide={chapter.Slide}
//             chapter={chapter.module}
//             nextChapterId={nextChapter}
//             preChapter={preChapter}
//             courseId={params.courseId}
//             course={course}
//           />
//         </div>
//         <div>
//           <div>
//             <Preview value={chapter.module.description} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChapterIdPage;
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import Slide from "./_components/slide";
import { db } from "@/lib/db";
import { AlertInExam } from "@/components/ui/alert-in-exam";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  let userInfo: any = await db.user.findUnique({
    where: { id: userId },
    include: {
      userExamReport: {},
    },
  });

  const {
    chapter,
    course,
    preChapter,
    nextChapter,
  }: any = await getChapter({
    userId,
    moduleId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  return (
    <div className="pl-6 pt-3">
      <div className="flex flex-col pb-20 overflow-x-hidden">
        {/* Hiển thị Slide */}
        <div>
          <Slide
            slide={chapter.Slide}
            chapter={chapter.module}
            nextChapterId={nextChapter}
            preChapter={preChapter}
            courseId={params.courseId}
            course={course}
          />
        </div>

        {/* Hiển thị mô tả của module */}
        <div>
          <Preview value={chapter.module.description} />
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
