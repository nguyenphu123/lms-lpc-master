import Link from "next/link";
import Image from "next/image";
import { CourseProgress } from "@/components/course-progress";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
interface MyCourseProps {
  data: any;
}

export const MyCourse = ({ data }: MyCourseProps) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <h3 className="text-lg font-semibold mb-4">My Course</h3>
        </PopoverTrigger>
        <PopoverContent>
          {data.ClassSessionRecord.length > 0 ? (
            data.ClassSessionRecord.map((course: any) => (
              <div key={course.course.id}>
                <Link
                  className="flex flex-col md:flex-row md:items-center"
                  href={`/courses/${course.course.id}`}
                >
                  <div className="relative w-full md:w-1/3 aspect-video rounded-md overflow-hidden">
                    <Image
                      fill
                      className="object-cover"
                      alt={course.course.title}
                      src={
                        course.course.imageUrl != null
                          ? course.course.imageUrl.replace("public", "")
                          : ""
                      }
                    />
                  </div>
                  <div className="md:w-2/3 md:pl-4">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                      {course.course.title}
                    </div>
                    {course.progress !== null ? (
                      <CourseProgress
                        variant={
                          parseInt(course.progress) === 100
                            ? "success"
                            : "default"
                        }
                        size="sm"
                        value={parseInt(course.progress)}
                      />
                    ) : (
                      <p className="text-md md:text-sm font-medium text-slate-700">
                        {/* {formatPrice(price)} */}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">My Course</h3>
              <p className="mb-4">
                Start studying now:{" "}
                <Link href="/search" className="text-blue-700 hover:underline">
                  Browse courses
                </Link>
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
