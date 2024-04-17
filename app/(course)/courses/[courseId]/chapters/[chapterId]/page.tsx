import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import Exam from "./_components/exam";
import Slide from "./_components/slide";
const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const {
    chapter,
    course,

    nextChapter,
    userProgress,
    purchase,
  }: any = await getChapter({
    userId,
    moduleId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  return chapter.type == "Exam" ? (
    <>
      <Exam
        chapter={chapter}
        nextChapterId={nextChapter}
        courseId={params.courseId}
        course={course}
        isCompleted={userProgress?.status}
      />
    </>
  ) : (
    <div>
      {userProgress?.status == "finished" && (
        <Banner variant="success" label="You already completed this Module." />
      )}

      <div className="flex flex-col max-w-4xl pb-20">
        <div>
          <Slide
            slide={chapter.Slide}
            chapter={chapter}
            nextChapterId={nextChapter}
            courseId={params.courseId}
            course={course}
            isCompleted={userProgress?.status}
          ></Slide>
        </div>
        <div>
          <div>
            <Preview value={chapter.description!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
