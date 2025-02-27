"use client";
import DocViewer, { MSDocRenderer, PDFRenderer } from "@cyntler/react-doc-viewer";
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
  // slide,
  preChapter,
  nextChapterId,
  courseId,
  chapter,
  course,
}: any) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const [onFinish, setOnFinish] = useState(false);
  const module = chapter;
  const [doc, setDoc] = useState(module?.fileUrl);

  const confetti = useConfettiStore();
  const supportedFileTypes = ["pdf", "pptx", "docx"];
  const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    return supportedFileTypes.includes(extension!) ? extension : "default";
  };

  const onClickNextSlide = async () => {
    setCurrentSlide(currentSlide + 1);
    setDoc(module.fileUrl);
    router.refresh();
  };

  const onClickPre = async () => {
    router.push(`/courses/${courseId}/chapters/${preChapter}`);
  };

  const onClick = async () => {
    const onClick = () => {
      if (nextChapterId != null) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        router.refresh();
      }
    };
  };

  const accept = () => {
    setOnFinish(false);
    router.push(`/`);
    router.refresh();
  };

  if (!module) {
    return <>This module is updating.</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <AlertDialog open={onFinish}>
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
          {module.contentType === "video" ? (
            <div className="ml-4 mt-4">
              <video width="1080" height="720" controls autoPlay>
                <source src={module.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div>{module.description}</div>
            </div>
          ) : module.contentType === "text" ? (
            <div key={module.id}>
              <div>{module.title}</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: module.content,
                }}
              ></div>
            </div>
          ) : getFileType(module.fileUrl) !== "pdf" ? (
            <DocViewer
              prefetchMethod="GET"
              documents={[
                {
                  uri: module.fileUrl,
                  fileType: getFileType(module.fileUrl),
                },
              ]}
              pluginRenderers={[MSDocRenderer]}
              style={{ width: 1080, height: 650 }}
              theme={{ disableThemeScrollbar: false }}
            />
          ) : (
            <iframe
              key={module.fileUrl}
              src={module.fileUrl}
              style={{ width: 1080, height: 650 }}
            />
          )}

          <div className="items-end">
            {currentSlide === 0 ? (
              <></>
            ) : (
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded mt-4 ml-4"
                onClick={() => setCurrentSlide(currentSlide - 1)}
              >
                Previous
              </button>
            )}

            {currentSlide === module.length - 1 ? (
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
                      Previous Module
                    </button>
                  )}

                  <button
                    onClick={() => onClick()}
                    className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded mt-4 ml-4"
                  >
                    Finish Course
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