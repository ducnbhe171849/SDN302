import React, { useEffect, useRef, useState } from "react";
import { Form, redirect, useLoaderData } from "react-router-dom";
import { EmployeeSchema } from "../dto/employee/create-employee.dto";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import { Button } from "../components";
import { FiUpload } from "react-icons/fi";
const cloudName = import.meta.env.VITE_CLOUD_NAME;
const cloudPreset = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

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

      const { data } = await customFetch.get(
        "/employee/information/emailsPhones"
      );

      return {
        departments: res.data.data,
        emails: data.emails,
        phones: data.phones,
      };
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.error?.message || "There was an error";
      toast.error(errorMessage);
      if (error?.response?.status === 401 || 403) {
        return redirect("/employee/create");
      }
    }

    return null;
  };

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const validData = EmployeeSchema.safeParse(data);

  if (!validData.success) {
    const newErrors = validData?.error?.formErrors?.fieldErrors;

    let errorMessages = [
      newErrors?.fullName ? newErrors.fullName[0] + ", " : "",
      newErrors?.dateOfBirth ? newErrors.dateOfBirth[0] : "",
      newErrors?.gender ? newErrors.gender[0] : "",
      newErrors?.address ? newErrors.address[0] : "",
      newErrors?.phoneNumber ? newErrors.phoneNumber[0] : "",
      newErrors?.department ? newErrors.department[0] : "",
      newErrors?.position ? newErrors.position[0] : "",
      newErrors?.salary ? newErrors.salary[0] : "",
      newErrors?.startDate ? newErrors.startDate[0] : "",
      newErrors?.image ? newErrors.image[0] : "",
      newErrors?.email ? newErrors.email[0] : "",
    ].join(" ");
    toast.error(errorMessages);

    return redirect("/employee/create");
  }
  console.log(validData.data);

  try {
    const res = await customFetch.post("/employee/create", {
      ...validData.data,
      avatar: validData.data.avatar,
    });

    if (res.data?.error || res.data?.errors) {
      if (res.data?.errors) {
        res.data?.errors.map((item) => {
          toast.error(item.msg);
        });
      } else {
        toast.error("Email or phone number is already exist");
      }
    } else {
      toast.success("create employee success");
    }

    return redirect("/employee/create");
  } catch (error) {
    console.log(error);
    const errorMessage = error?.response?.message || "There was an error";
    toast.error(errorMessage);
    if (error?.response?.status === 401 || 403) {
      return redirect("/employee/create");
    }
  }

  return null;
};

const CreateEmployee = () => {
  /**
   * ====================================
   * upload image to cloud
   * ====================================
   */
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: cloudPreset,
      },
      (error, result) => {
        if (result.event == "success") {
          if (result.info.url) {
            setImagePreview(result.info.url);
          }
        }
      }
    );
  }, []);
  // end upload image to cloud

  const { departments, emails, phones } = useLoaderData();

  const [imagePreview, setImagePreview] = useState(""); // State để lưu ảnh xem trước

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-orange-600">
        Tạo nhân viên mới
      </h2>

      <Form method="post">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ tên */}
          <div className="mb-6">
            <label htmlFor="fullName" className="block text-lg font-semibold ">
              Họ tên
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="input input-bordered w-full validator"
              placeholder="Nhập họ tên"
              required
            />
          </div>

          {/* Ngày sinh */}
          <div className="mb-6">
            <label
              htmlFor="dateOfBirth"
              className="block text-lg font-semibold"
            >
              Ngày sinh
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              onChange={(e) => {
                const dob = new Date(e.target.value); // Lấy ngày sinh từ input
                const today = new Date(); // Lấy ngày hiện tại

                let age = today.getFullYear() - dob.getFullYear(); // Tính tuổi dựa trên năm
                const monthDifference = today.getMonth() - dob.getMonth(); // Tính sự chênh lệch tháng

                // Kiểm tra nếu ngày sinh chưa đến trong năm nay
                if (
                  monthDifference < 0 ||
                  (monthDifference === 0 && today.getDate() < dob.getDate())
                ) {
                  age--;
                }

                if (age < 18) {
                  toast.error("Nhân viên chưa đủ 18 tuổi");
                }
              }}
              className="input input-bordered w-full validator"
              required
            />
          </div>

          {/* Giới tính */}
          <div className="mb-6 flex flex-col">
            <label className="block text-lg font-semibold">Giới tính</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  defaultChecked
                  className="radio radio-primary"
                />
                <span className="ml-2">Nam</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  className="radio radio-primary"
                />
                <span className="ml-2">Nữ</span>
              </label>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="mb-6">
            <label htmlFor="address" className="block text-lg font-semibold">
              Địa chỉ
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="input input-bordered w-full validator"
              placeholder="Nhập địa chỉ"
              required
            />
          </div>

          {/* Số điện thoại */}
          <div className="mb-6">
            <label
              htmlFor="phoneNumber"
              className="text-lg font-semibold flex items-center gap-2"
            >
              Số điện thoại{" "}
              <p className="text-sm"> (Số điện thoại phải là duy nhất)</p>
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              onChange={(e) => {
                phones.forEach((element) => {
                  if (element == e.target.value.trim()) {
                    toast.error(
                      "Số điện thoại này đã được dùng! Vui lòng chọn số khác"
                    );
                  }
                });
              }}
              type="tel"
              pattern="[0-9]{10}"
              className="input input-bordered w-full validator"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          {/* Phòng ban */}
          <div className="mb-6">
            <label htmlFor="department" className="block text-lg font-semibold">
              Phòng ban
            </label>
            <select
              id="department"
              name="department"
              className="select select-bordered w-full"
            >
              <option value="null">Chọn phòng ban</option>
              {departments.map(({ _id, departmentName }) => {
                return (
                  <option key={_id} value={_id}>
                    {departmentName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Chức vụ */}
          <div className="mb-6">
            <label htmlFor="position" className="block text-lg font-semibold">
              Chức vụ
            </label>
            <input
              id="position"
              name="position"
              type="text"
              className="input input-bordered w-full"
              placeholder="Nhập chức vụ"
              required
            />
          </div>

          {/* Mức lương */}
          <div className="mb-6">
            <label htmlFor="salary" className="block text-lg font-semibold">
              Mức lương
            </label>
            <input
              id="salary"
              name="salary"
              type="number"
              min="1"
              className="input input-bordered w-full"
              placeholder="Nhập mức lương"
              required
            />
          </div>

          {/* Ngày bắt đầu làm việc */}
          <div className="mb-6">
            <label htmlFor="startDate" className="block text-lg font-semibold">
              Ngày bắt đầu làm việc
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Ảnh đại diện */}

          <div className="mb-6">
            <label htmlFor="avatar" className="block text-lg font-semibold">
              Ảnh đại diện
            </label>

            <input
              id="avatar"
              name="avatar"
              type="hidden"
              onChange={() => {
                setImagePreview();
              }}
              value={imagePreview ?? ""}
              className="input input-bordered w-full"
            />
            <button
              type="button"
              onClick={() => {
                return widgetRef.current.open();
              }}
              className="btn btn-primary flex items-center gap-2"
            >
              <FiUpload className="w-5 h-5" />
              Upload ảnh
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="text-lg font-semibold flex items-center gap-2"
          >
            Email to login
            <p className="text-sm"> (Email phải là duy nhất)</p>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={(e) => {
              emails.forEach((element) => {
                if (element == e.target.value.trim()) {
                  toast.error("Email này đã tồn tại! Vui lòng dùng email khác");
                }
              });
            }}
            className="input input-bordered w-full"
            placeholder="Nhập Gmail"
            required
          />
          <p className="">Employee must changed password in first time login</p>
        </div>

        {/* Hiển thị ảnh xem trước */}
        {imagePreview && (
          <div className="mb-6 flex justify-center flex-col items-center">
            <label className="block text-lg font-semibold">Ảnh xem trước</label>
            <img
              src={imagePreview ?? ""}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border-2"
            />
          </div>
        )}

        {/* Nút gửi */}
        <div className="text-center">
          <Button text={"Create employee"}></Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateEmployee;
