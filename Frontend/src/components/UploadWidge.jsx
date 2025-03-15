import React, { useEffect, useRef } from "react";

const UploadWidge = () => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dzq1rcnwl",
        uploadPreset: "ml_default",
      },
      (error, result) => {
        console.log(result);

        console.log(result.info.url);
      }
    );
  }, []);
  return (
    <button
      onClick={() => {
        return widgetRef.current.open();
      }}
    >
      Upload ảnh
    </button>
  );
};

export default UploadWidge;
