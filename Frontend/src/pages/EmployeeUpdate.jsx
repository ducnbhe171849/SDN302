import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import moment from "moment";
import { UpdateEmployeeSchema } from "../dto/employee/update-employee.dto";
const cloudName = import.meta.env.VITE_CLOUD_NAME;
const cloudPreset = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;
import { FiUpload } from "react-icons/fi";

export const loader =
  (store) =>
  async ({ params }) => {
    const { id } = params;
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
      const res = await customFetch.get("/employee/" + id);

      const { data } = await customFetch.get(
        "/employee/information/emailsPhones"
      );

      const resDepartment = await customFetch.get("/department");

      return {
        employee: res.data.data,
        departments: resDepartment.data.data,
        phones: data.phones,
      };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error?.message || "There was an error";
      toast.error(errorMessage);
      if (error?.response?.status === 401 || 403) {
        return redirect("/employee/edit/" + id);
      }
    }

    return null;
  };

export const action = async ({ request, params }) => {
  const { id } = params;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  if (!data.avatar) {
    delete data.avatar;
  }

  const validData = UpdateEmployeeSchema.safeParse(data);
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

  try {
    await customFetch.patch(`/employee/${id}`, {
      ...validData.data,
    });

    toast.success("Update information successfully");
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.error?.message || "There was an error";
    toast.error(errorMessage);
    if (error?.response?.status === 401 || 403) {
      return redirect("/employee/edit/" + id);
    }
  }

  return null;
};

const EditEmployee = ({ employeeData }) => {
  const { employee, departments, phones } = useLoaderData();
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

  const {
    _id,
    address,
    avatar,
    dateOfBirth,
    department,
    fullName,
    gender,
    phoneNumber,
    position,
    startDate,
  } = employee;

  const [imagePreview, setImagePreview] = useState(avatar || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-orange-600">
        Chỉnh sửa thông tin nhân viên
      </h2>

      <Form method="post">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ tên */}
          <div>
            <label className="block text-lg font-semibold">Họ tên</label>
            <input
              type="text"
              name="fullName"
              defaultValue={fullName}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-lg font-semibold">Ngày sinh</label>
            <input
              type="date"
              name="dateOfBirth"
              defaultValue={moment(dateOfBirth).format("YYYY-MM-DD")}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-lg font-semibold">Giới tính</label>
            <select
              name="gender"
              defaultValue={gender}
              className="select select-bordered w-full"
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-lg font-semibold">Địa chỉ</label>
            <input
              type="text"
              name="address"
              defaultValue={address}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-lg font-semibold">Số điện thoại</label>
            <input
              type="tel"
              name="phoneNumber"
              defaultValue={phoneNumber}
              onChange={(e) => {
                phones.forEach((element) => {
                  if (
                    element == e.target.value.trim() &&
                    element != phoneNumber
                  ) {
                    toast.error(
                      "Số điện thoại này đã được dùng! Vui lòng chọn số khác"
                    );
                  }
                });
              }}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Phòng ban */}
          <div>
            <label className="block text-lg font-semibold">Phòng ban</label>
            <select
              name="department"
              defaultValue={department?._id}
              className="select select-bordered w-full"
              required
            >
              <option value="">Chọn phòng ban</option>
              {departments.map(({ _id, departmentName }) => {
                return (
                  <option value={_id} key={_id}>
                    {departmentName}{" "}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Chức vụ */}
          <div>
            <label className="block text-lg font-semibold">Chức vụ</label>
            <input
              type="text"
              name="position"
              defaultValue={position}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Ngày bắt đầu làm việc */}
          <div>
            <label className="block text-lg font-semibold">
              Ngày bắt đầu làm việc
            </label>
            <input
              type="date"
              name="startDate"
              defaultValue={moment(startDate).format("YYYY-MM-DD")}
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

        {/* Hiển thị ảnh xem trước */}
        {imagePreview && (
          <div className="mt-4 flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border-2"
            />
          </div>
        )}

        {/* Nút lưu */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="btn btn-success text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Lưu thay đổi
          </button>
        </div>
      </Form>
    </div>
  );
};

export default EditEmployee;
