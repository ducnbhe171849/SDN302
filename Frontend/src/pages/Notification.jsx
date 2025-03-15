import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";
import {
  Navigate,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { customFetch } from "../utils/customAxios";
import Swal from "sweetalert2";
const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

/**
 * ====================================
 * loader
 * ====================================
 */

export const loader =
  (store) =>
  async ({ request }) => {
    const { userState } = store.getState();

    if (!userState?.user) {
      toast.warn("Please login first");
      return redirect("/login");
    }

    if (userState.user?.role != "Admin") {
      toast.error("Forbidden resource");
      return redirect("/login");
    }

    try {
      const res = await customFetch.get("/department");
      console.log(res);
      return {
        departments: res.data.data,
      };
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.message);
      if (error?.response?.message === 401 || 403) {
        return redirect("/login");
      }
    }

    return null;
  };

const NotificationForm = () => {
  const { departments } = useLoaderData();

  const navigate = useNavigate();

  // State để lưu trữ dữ liệu form
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("all");

  const [content, setContent] = useState("");

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  // Danh sách các phòng ban

  // Xử lý khi form được submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hiển thị hộp thoại xác nhận
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn có muốn gửi thông báo này không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, gửi đi!",
      cancelButtonText: "Hủy",
    });

    // Nếu người dùng xác nhận
    if (result.isConfirmed) {
      Swal.fire({
        title: "Đã gửi!",
        text: "Thông báo của bạn đã được gửi thành công.",
        icon: "success",
      });

      const res = await customFetch.post("/notification", {
        title,
        content,
        department,
      });

      // Reset form sau khi gửi
      navigate("/notification");
    }
  };

  return (
    <div className="p-6 m-0   bg-white shadow-lg rounded-lg w-full  ">
      <h2 className="text-2xl font-bold mb-4">Gửi Thông Báo</h2>

      <form onSubmit={handleSubmit}>
        {/* Nhập tiêu đề */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Tiêu đề</span>
          </label>
          <input
            type="text"
            placeholder="Nhập tiêu đề"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Nhập nội dung */}
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
          <div className="my-4 ">
            <h3>Nội dung đã nhập:</h3>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>

        {/* Chọn phòng ban */}
        <div className="form-control mb-6 ">
          <label className="label mb-2">
            <span className="label-text">Gửi đến</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="all">Tất cả</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>

        {/* Nút gửi */}
        <button type="submit" className="btn btn-success w-full">
          Gửi Thông Báo
        </button>
      </form>
    </div>
  );
};

export default NotificationForm;
