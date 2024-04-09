import { Program, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { useAuth } from "@clerk/nextjs";

type CourseWithProgressWithCategory = Course & {
  programs: Program | null;
  Module: { id: string }[];
  progress: string | null;
  BookMark: { length: number; id: string };
};

interface CoursesListInProgramProps {
  items: any[];
}

export const CoursesListInProgram = ({ items }: CoursesListInProgramProps) => {
  const { userId }: any = useAuth();
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chapters={item?.Module}
            chaptersLength={item.Module.length}
            bookmark={item.BookMark}
            isLocked={
              item?.ClassSessionRecord.map(
                (item: { userId: any }) => item.userId
              ).indexOf(userId) == -1
                ? true
                : false
            }
            // price={item.price!}
            progress={item.progress}
            description={item?.description}
            // category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  );
};
