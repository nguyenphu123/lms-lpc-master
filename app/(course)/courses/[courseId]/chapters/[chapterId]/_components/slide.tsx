"use client";
import DocViewer, {
  MSDocRenderer,
  PDFRenderer,
} from "@cyntler/react-doc-viewer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CustomFileRenderer = ({ mainState: { currentDocument } }: any) => {
  if (!currentDocument || !currentDocument.uri) return null;
  const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    currentDocument.uri
  )}`;

  return (
    <object
      data={viewerUrl}
      style={{ width: "100%", height: "80vh", border: "none" }}
      type={`application/pdf`}
    >
      <p>
        Unable to display PDF file. <a href={viewerUrl}>Download</a> instead.
      </p>
    </object>
  );
};

CustomFileRenderer.fileTypes = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
CustomFileRenderer.weight = 10;

const Slide = ({
  slide,
  preChapter,
  nextChapterId,
  courseId,
  isCompleted,
  chapter,
  course,
}: any) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const [onFinish, setOnFinish] = useState(false);
  const [doc, setDoc] = useState(slide[currentSlide]?.fileUrl);
  const [hasCompleted, setHasCompleted] = useState(
    isCompleted == "finished" &&
      course.ClassSessionRecord[0].status == "finished"
      ? "finished"
      : "studying"
  );

  const confetti = useConfettiStore();
  const supportedFileTypes = ["pdf", "pptx", "docx"];
  const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    return supportedFileTypes.includes(extension!) ? extension : "default";
  };

  const onClickNextSlide = async () => {
    if (hasCompleted == "finished") {
      setCurrentSlide(currentSlide + 1);
      setDoc(slide[currentSlide].fileUrl);
    } else {
      const date = new Date();

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
        {
          status: "studying",
          progress: (currentSlide / (slide.length - 1)) * 100 + "%",
          endDate: date,
        }
      );
      setCurrentSlide(currentSlide + 1);
      setDoc(slide[currentSlide].fileUrl);
    }
    router.refresh();
  };
  const onClickPre = async () => {
    router.push(`/courses/${courseId}/chapters/${preChapter}`);
  };
  const onClick = async () => {
    if (hasCompleted == "finished") {
      if (nextChapterId != null) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      } else {
        router.push(`/`);
      }
    } else {
      const date = new Date();
      if (chapter.title == "intro") {
      } else {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapter.id}/progress`,
          {
            status: "finished",
            progress: "100%",
            endDate: date,
          }
        );
      }

      if (nextChapterId != null) {
        let checkIfNextChapterIsFinished = await axios.get(
          `/api/courses/${courseId}/chapters/${nextChapterId}/progress`
        );
        console.log(checkIfNextChapterIsFinished);
        if (checkIfNextChapterIsFinished?.data?.status == "finished") {
          if (checkIfNextChapterIsFinished.data.nextChapterId != undefined) {
          } else {
            await axios.put(`/api/courses/${courseId}/progress`, {
              status: "finished",
              progress: "100%",
              endDate: date,
            });
          }
        } else {
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
        }

        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        router.refresh();
      } else {
        await axios.put(`/api/courses/${courseId}/progress`, {
          status: "finished",
          progress: "100%",
          endDate: date,
        });
        confetti.onOpen();
        let currentUser = await axios.get(`/api/user`);
        await axios.patch(`/api/user/${currentUser.data.id}/score`, {
          star: parseInt(currentUser.data.star) + parseInt(course.credit),
        });
        setOnFinish(true);
        setHasCompleted("finished");
        // router.push(`/`);

        setTimeout(function () {
          // function code goes here
        }, 10000);
        if (onFinish) {
          router.push(`/`);
          router.refresh();
        }
      }
    }
  };
  const accept = () => {
    setOnFinish(false);
    router.push(`/`);
    router.refresh();
  };

  return slide.length < 1 ? (
    <>This module is updating.</>
  ) : (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <AlertDialog open={onFinish && hasCompleted != "finished"}>
          <AlertDialogContent className="AlertDialogContent">
            <AlertDialogTitle className="AlertDialogTitle">
              Congratulation on finishing this Course, Would you like to find
              another course?
              <Image
                src="/congratulation.jpg"
                alt="blog"
                height={300}
                width={400}
                className="select-none object-cover rounded-md border-2 border-white shadow-md drop-shadow-md w-150 h-full"
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="AlertDialogDescription"></AlertDialogDescription>
            <div
              style={{
                display: "flex",
                gap: 25,
                justifyContent: "flex-end",
              }}
            >
              <AlertDialogCancel onClick={() => setOnFinish(false)}>
                Stay
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <button className="Button red" onClick={() => accept()}>
                  Leave
                </button>
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <div>
          {slide[currentSlide].contentType == "video" ? (
            <div className="ml-4 mt-4">
              <video width="1080" height="720" controls autoPlay>
                <source src={slide[currentSlide].videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div>{slide[currentSlide].description}</div>
            </div>
          ) : slide[currentSlide].contentType == "text" ? (
            <div key={slide[currentSlide].id}>
              <div>{slide[currentSlide].title}</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: slide[currentSlide].content,
                }}
              ></div>
            </div>
          ) : getFileType(slide[currentSlide].fileUrl) != "pdf" ? (
            <DocViewer
              prefetchMethod="GET"
              documents={[
                {
                  uri: slide[currentSlide].fileUrl,
                  fileType: getFileType(slide[currentSlide].fileUrl),
                },
              ]}
              pluginRenderers={[MSDocRenderer]}
              style={{ width: 1080, height: 650 }}
              theme={{ disableThemeScrollbar: false }}
            />
          ) : (
            <iframe
              key={slide[currentSlide].fileUrl}
              src={slide[currentSlide].fileUrl}
              style={{ width: 1080, height: 650 }}
            />
            // <DocViewer
            //   key={slide[currentSlide].fileUrl}
            //   prefetchMethod="GET"
            //   config={{
            //     header: {
            //       disableHeader: true,
            //       disableFileName: true,
            //     },
            //     loadingRenderer: {
            //       showLoadingTimeout: 5000,
            //     },
            //     pdfVerticalScrollByDefault: true,
            //   }}
            //   documents={[
            //     {
            //       uri: slide[currentSlide].fileUrl,
            //       fileType: getFileType(slide[currentSlide].fileUrl),
            //     },
            //   ]}
            //   pluginRenderers={[PDFRenderer]}
            //   style={{ width: 1080, height: 650 }}
            //   theme={{ disableThemeScrollbar: false }}
            // />
          )}

          <div className="items-end">
            {currentSlide == 0 ? (
              <></>
            ) : (
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded mt-4 ml-4"
                onClick={() => setCurrentSlide(currentSlide - 1)}
              >
                Previous
              </button>
            )}

            {currentSlide === slide.length - 1 ? (
              nextChapterId !== undefined ? (
                <div>
                  <button
                    onClick={() => onClick()}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4 ml-4"
                  >
                    Next module
                  </button>
                </div>
              ) : (
                <div>
                  {preChapter && (
                    <button
                      onClick={() => onClickPre()}
                      className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded mt-4 ml-4"
                    >
                      Previsous Module
                    </button>
                  )}

                  <button
                    onClick={() => onClick()}
                    className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded mt-4 ml-4"
                  >
                    {hasCompleted != "finished"
                      ? "Finish Course"
                      : "Return to Home"}
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={() => onClickNextSlide()}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4 ml-4"
              >
                Next slide
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default Slide;
