import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import Exam from "./_components/exam";
import Slide from "./_components/slide";
import Link from "next/link";
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
    preChapter,
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
    <div className="pl-2">
      {userProgress?.status == "finished" && (
        <Banner variant="success" label="You already completed this Module." />
      )}

      <div className="flex flex-col pb-20 overflow-x-hidden">
        <div>
          <Slide
            slide={chapter.Slide}
            chapter={chapter}
            nextChapterId={nextChapter}
            preChapter={preChapter}
            courseId={params.courseId}
            course={course}
            isCompleted={userProgress?.status}
          ></Slide>
          Extra resources:{" "}
          {chapter.Resource.map((item: any) => (
            <Link key={item.attachment} href={item.attachment}>
              {item.attachment.split("/").pop() as string}
            </Link>
          ))}
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
