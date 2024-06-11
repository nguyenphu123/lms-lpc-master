import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { MyActivity } from "@/components/my-activity";
import { Recommend } from "@/components/recommend";
import { Bookmark } from "@/components/bookmark";
import { SearchInput } from "@/components/search-input";
import { getProgress } from "@/actions/get-progress";
import { CompletedCourse } from "@/components/completed-course";
import { AlertInExam } from "@/components/ui/alert-in-exam";

export default async function Dashboard({
  params,
}: {
  params: { email: string; task: string };
}) {
  const { sessionClaims }: any = auth();

  if (!sessionClaims?.userId) {
    if (params.email != undefined && params.task != undefined) {
      console.log(params);
      return redirect(`/sign-in/?email=${params.email}&task=${params.task}`);
    }
    return redirect("/sign-in");
  }
  let userInfo: any = await db.user.findUnique({
    where: { id: sessionClaims?.userId },
    include: {
      userExamReport: {
        where: {
          isInExam: true,
        },
      },
    },
  });
  if (userInfo?.status == "pending") {
    return redirect("/pending");
  }
  if (userInfo?.status == "ban") {
    return redirect("/ban");
  }
  await db.user.update({
    where: { id: sessionClaims.userId },
    data: {
      imageUrl: sessionClaims.userImage || "",
    },
  });

  let myActivity: any = await db.classSessionRecord.findMany({
    where: {
      userId: sessionClaims.userId,
      status: { not: "finished" },
    },
    include: {
      course: {
        include: {
          Module: {
            where: {
              isPublished: true,
            },
          },
          ClassSessionRecord: true,
          BookMark: true,
        },
      },
    },
  });

  let recommendCourses: any = await db.department.findUnique({
    where: {
      id: userInfo.departmentId + "",
      CourseOnDepartment: {
        every: {
          course: {
            isPublished: true,
            ClassSessionRecord: {
              every: {
                userId: sessionClaims.userId,
                status: { not: "finished" },
              },
            },
          },
        },
      },
    },
    include: {
      CourseOnDepartment: {
        include: {
          course: {
            where: {
              isPublished: true,
            },
            include: {
              Module: {
                where: {
                  isPublished: true,
                },
              },
              BookMark: true,
              ClassSessionRecord: true,
            },
          },
        },
      },
    },
  });
  let allCourses = await db.course.findMany({
    where: {
      ...(recommendCourses
        ? {
            CourseOnDepartment: {
              every: {
                id: recommendCourses.id,
              },
            },
          }
        : {}),
      ClassSessionRecord: {
        every: {
          userId: sessionClaims.userId,
          status: { not: "finnish" },
        },
      },
      isPublished: true,
    },
    include: {
      Module: {
        where: {
          isPublished: true,
        },
      },
      BookMark: true,
      ClassSessionRecord: {
        where: {
          userId: sessionClaims.userId,
          status: { not: "finnish" },
        },
      },
    },
  });

  let courses = recommendCourses?.CourseOnDepartment || [];
  for (let i = 0; i < allCourses.length; i++) {
    let newItem = {
      course: allCourses[i],
    };
    courses.push(newItem);
  }

  let bookmark: any = await db.course.findMany({
    where: {
      isPublished: true,
      BookMark: {
        some: {
          userId: sessionClaims.userId,
        },
      },
    },
    include: {
      Module: {
        where: {
          isPublished: true,
        },
      },
      BookMark: true,
      ClassSessionRecord: true,
    },
  });

  let completedCourse: any = await db.classSessionRecord.findMany({
    where: {
      userId: sessionClaims.userId,
      status: "finished",
    },
    include: {
      course: {
        include: {
          Module: {
            where: {
              isPublished: true,
            },
          },
          ClassSessionRecord: true,
          BookMark: true,
        },
      },
    },
  });
  const coursesWithProgress: any = await Promise.all(
    bookmark.map(async (course: { id: any }) => {
      const progressPercentage = await getProgress(
        sessionClaims.userId,
        course.id
      );

      return {
        ...course,
        progress: progressPercentage,
      };
    })
  );

  const coursesWithProgress2: any = await Promise.all(
    myActivity.map(async (course: { course: any }) => {
      const progressPercentage = await getProgress(
        sessionClaims.userId,
        course?.course?.id
      );

      return {
        ...course,
        progress: progressPercentage,
      };
    })
  );

  const coursesWithProgress3: any = await Promise.all(
    courses.map(async (course: any) => {
      const progressPercentage = await getProgress(
        sessionClaims.userId,
        course.course.id
      );

      return {
        ...course,
        progress: progressPercentage,
      };
    })
  );

  const coursesWithProgress4: any = await Promise.all(
    completedCourse.map(async (course: { course: any }) => {
      const progressPercentage = await getProgress(
        sessionClaims.userId,
        course?.course?.id
      );

      return {
        ...course,
        progress: progressPercentage,
      };
    })
  );

  return userInfo.userExamReport[0]?.isInExam ? (
    <AlertInExam
      courseId={userInfo.userExamReport[0]?.courseId}
      moduleId={userInfo.userExamReport[0]?.moduleId}
    ></AlertInExam>
  ) : (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        {/* <SlideProgram items={courses} /> */}
        {/* <Categories items={categories} /> */}
        <MyActivity items={coursesWithProgress2} />
       
        <Bookmark items={coursesWithProgress} />
        <CompletedCourse items={coursesWithProgress4} />
        <Recommend items={coursesWithProgress3} />
      </div>
    </>
  );
}
