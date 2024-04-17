import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { MyActivity } from "@/components/my-activity";
import { Recommend } from "@/components/recommend";
import { Bookmark } from "@/components/bookmark";
import { SearchInput } from "@/components/search-input";
import { getProgress } from "@/actions/get-progress";
import { CompletedCourse } from "@/components/completed-course";

export default async function Dashboard() {
  const { sessionClaims }: any = auth();

  if (!sessionClaims?.userId) {
    return redirect("/sign-in");
  }
  let userInfo = await db.user.findUnique({
    where: { id: sessionClaims.userId, status: "approved" },
  });
  if (userInfo == undefined) {
    return redirect("/pending");
  }

  await db.user.update({
    where: { id: sessionClaims.userId },
    data: {
      imageUrl: sessionClaims.userImage || "",
    },
  });

  const examList = await db.module.findMany({
    where: {
      type: "Exam",
    },
  });
  for (let i = 0; i < examList.length; i++) {
    let date = 24;
    if (examList[i].waitTime == 3) {
      date = 72;
    }
    if (examList[i].waitTime == 7) {
      date = 168;
    }
    var tsYesterday: Date = new Date(
      Date.UTC(2012, 5, 17, 22, 34) - date * 3600 * 1000
    );

    await db.userProgress.updateMany({
      where: {
        userId: sessionClaims.userId,
        status: "studying",
        endDate: tsYesterday,
      },

      data: {
        attempt: 0,
      },
    });
  }

  let myActivity: any = await db.classSessionRecord.findMany({
    where: {
      userId: sessionClaims.userId,
      status: { not: "finished" },
      progress: { not: "100%" },
    },
    include: {
      course: {
        include: {
          Module: true,
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
                status: { not: "finnish" },
                progress: { not: "100%" },
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
              Module: true,
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
          progress: { not: "100%" },
        },
      },
      isPublished: true,
    },
    include: {
      Module: true,
      BookMark: true,
      ClassSessionRecord: {
        where: {
          userId: sessionClaims.userId,
          status: { not: "finnish" },
          progress: { not: "100%" },
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
      Module: true,
      BookMark: true,
      ClassSessionRecord: true,
    },
  });
  // console.log(myActivity);
  // console.log(courses);

  let completedCourse: any = await db.classSessionRecord.findMany({
    where: {
      userId: sessionClaims.userId,
      status: "finished",
      progress: "100%",
    },
    include: {
      course: {
        include: {
          Module: true,
          ClassSessionRecord: true,
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

  return !userInfo ? (
    <>Sorry you are not approved, please send money to admin to get approval</>
  ) : (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        {/* <SlideProgram items={courses} /> */}
        {/* <Categories items={categories} /> */}
        <MyActivity items={coursesWithProgress2} />
        <Recommend items={coursesWithProgress3} />
        <Bookmark items={coursesWithProgress} />
        <CompletedCourse items={coursesWithProgress4} />
      </div>
    </>
  );
}
