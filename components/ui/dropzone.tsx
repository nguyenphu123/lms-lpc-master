"use client";

import Image from "next/image";
import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
// import { getSignature, saveToDatabase } from "../_actions";

const Dropzone = ({ className }: any) => {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  const onDrop = useCallback((acceptedFiles: any, rejectedFiles: any) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles): any => [
        ...acceptedFiles.map((file: any) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles): any => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    maxFiles: 1,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, [files]);

  async function action() {
    const file = files[0];
    if (!file) return;

    // get a signature using server action
    // const { timestamp, signature } = await getSignature();

    // upload to cloudinary using the signature
    const formData = new FormData();

    formData.append("file", file);
    // formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    // formData.append("signature", signature);
    // formData.append("timestamp", timestamp);
    formData.append("folder", "next");

    // const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;
    // const data = await fetch(endpoint, {
    //   method: "POST",
    //   body: formData,
    // }).then((res) => res.json());

    // write to database using server actions
    // await saveToDatabase({
    //   version: data?.version,
    //   signature: data?.signature,
    //   public_id: data?.public_id,
    // });
  }

  return (
    <form action={action}>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <input {...getInputProps({ name: "file" })} />
        <div className="flex flex-col items-center justify-center gap-4">
          <ArrowUpTrayIcon className="h-5 w-5 fill-current" />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <section className="mt-10">
        <div className="flex gap-4">
          <h2 className="title text-3xl font-semibold">Preview</h2>
        </div>

        {/* Accepted files */}

        {/* Rejected Files */}
      </section>
    </form>
  );
};

export default Dropzone;
