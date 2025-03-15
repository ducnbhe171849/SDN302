import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

const TinyMCEEditor = () => {
  const [content, setContent] = useState("");

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    console.log("Nội dung cập nhật:", newContent);
  };

  return (
    <div>
      <h2>Soạn thảo văn bản</h2>
      <Editor
        apiKey={apiKey} // Thay bằng API Key của bạn hoặc dùng free
        initialValue="<p>Nhập nội dung của bạn tại đây...</p>"
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help",
        }}
        onEditorChange={handleEditorChange}
      />
      <div>
        <h3>Nội dung đã nhập:</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default TinyMCEEditor;
