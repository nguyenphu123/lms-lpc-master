import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { SlideProgram } from "@/components/slide-program";
import { getProgress } from "@/actions/get-progress";
import { Categories } from "./_components/categories";
import { Recommend } from "@/components/recommend";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { sessionClaims, userId }: any = auth();

  if (!sessionClaims.userId) {
    return redirect("/");
  }
  function isEmpty(obj: object) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }

    return true;
  }
  let recommendCourses: any = await db.department.findUnique({
    where: {
      title:
        sessionClaims.userInfo.department != undefined ||
        !isEmpty(sessionClaims.userInfo)
          ? sessionClaims.userInfo.department
          : "no department",
      // CourseOnDepartment: {
      //   every: {
      //     course: {
      //       ClassSessionRecord: {
      //         every: {
      //           userId: sessionClaims.userId,
      //           status: { not: "finnish" },
      //           progress: { not: "100%" },
      //         },
      //       },
      //     },
      //   },
      // },
    },
    include: {
      CourseOnDepartment: {
        include: {
          course: {
            include: {
              Module: true,
              BookMark: true,
            },
          },
        },
      },
    },
  });
  let allCourses = await db.course.findMany({
    where: {
      ClassSessionRecord: {
        every: {
          userId: sessionClaims.userId,
          status: { not: "finished" },
          progress: { not: "100%" },
        },
      },
    },
    include: {
      Module: true,
      BookMark: true,
      ClassSessionRecord: {
        where: {
          userId: sessionClaims.userId,
          status: { not: "finished" },
          progress: { not: "100%" },
        },
      },
    },
  });
  // console.log(recommendCourses);
  // console.log(allCourses);
  let courses = recommendCourses.CourseOnDepartment;
  for (let i = 0; i < allCourses.length; i++) {
    let newItem = {
      course: allCourses[i],
    };
    courses.push(newItem);
  }

  const coursesWithProgress3: any = await Promise.all(
    courses.map(async (course: { id: any }) => {
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

  // await db.user.upsert({
  //   where: { id: sessionClaims.userId },
  //   update: {
  //     role: sessionClaims.userInfo.role || "staff",

  //     imageUrl: sessionClaims.userImage || "",
  //   },
  //   create: {
  //     id: sessionClaims.userId,
  //     email: sessionClaims.email,
  //     username: sessionClaims.username,
  //     star: 0,
  //     role: sessionClaims.userInfo.role || "staff",

  //     imageUrl: sessionClaims.userImage || "",
  //   },
  // });
  // await db.department.upsert({
  //   where: { title: sessionClaims.userInfo.department },
  //   create: {
  //     title: sessionClaims.userInfo.department,
  //     User: {
  //       connect: {
  //         id: sessionClaims.userId,
  //       },
  //     },
  //   },
  //   update: {
  //     title: sessionClaims.userInfo.department,
  //     User: {
  //       connect: {
  //         id: sessionClaims.userId,
  //       },
  //     },
  //   },
  // });

  let programs = await db.program.findMany({});
  const courses1: any = await getCourses({
    userId,
    ...searchParams,
  });
  // console.log(courses);
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <SlideProgram items={programs} />
        <Recommend items={coursesWithProgress3} />
        <Categories items={courses1} userId={sessionClaims.userId} />
      </div>
    </>
  );
};

export default SearchPage;
