import React from "react";
import { redirect, useLoaderData, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import moment from "moment";

export const loader = (store) => async () => {
  const { userState } = store.getState();

  if (!userState?.user) {
    toast.warn("Please login first");
    return redirect("/login");
  }

  const { role } = JSON.parse(localStorage.getItem("user"));

  if (role == "Admin") {
    toast.error("Admin không có thông tin");
    return redirect("/");
  }

  try {
    // check already attendance today

    const res = await customFetch.get("/user/detail");

    return {
      information: res.data.information,
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.message || "There was an error";
    toast.error(errorMessage);
    if (error?.response?.status === 401 || 403) {
      return redirect("/login");
    }
  }

  return null;
};

const MyProfile = () => {
  const { information } = useLoaderData();

  const mockEmployeeData = information;

  // Destructure dữ liệu giả
  const {
    avatar,
    fullName,
    position,
    dateOfBirth,
    gender,
    address,
    phoneNumber,
    department,
    salary,
    startDate,
    _id,
  } = mockEmployeeData;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center space-x-6">
        <img
          src={
            avatar ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGXOWxQl47sqmnDLNjD8gxyfxIS8MF5C18mQ&s"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-primary object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold">{fullName}</h2>
          <p className="text-lg text-gray-600">Chức vụ: {position}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Ngày sinh</p>
            <p>{moment(dateOfBirth).format("DD-MM-YYYY")}</p>
          </div>
          <div>
            <p className="font-semibold">Giới tính</p>
            <p>{gender}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Địa chỉ</p>
            <p>{address}</p>
          </div>
          <div>
            <p className="font-semibold">Số điện thoại</p>
            <p>{phoneNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Phòng ban</p>
            <p>
              {department?.departmentName ? department.departmentName : "No"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Ngày bắt đầu làm việc</p>
              <p>{moment(startDate).format("DD-MM-YYYY")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-2">
        <Link to={`/reset/password`} className="w-2/2">
          <button className="btn btn-secondary w-full">
            Đổi mật khẩu tài khoản
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MyProfile;
