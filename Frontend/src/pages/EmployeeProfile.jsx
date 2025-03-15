import React from "react";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import { Link, useLoaderData } from "react-router-dom";
import moment from "moment";

export const loader =
  (store) =>
  async ({ params }) => {
    const { id } = params;

    const { userState } = store.getState();
    // /employee/:id
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

      return {
        employee: res.data.data,
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

const EmployeeProfile = () => {
  const { employee } = useLoaderData();
  console.log(employee);
  const {
    _id,
    fullName,
    dateOfBirth,
    address,
    avatar,
    position,
    phoneNumber,
    gender,
    department,
    startDate,
    salary,
  } = employee;

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
          <h2 className="text-2xl font-semibold">{fullName} </h2>
          <p className="text-lg text-gray-600">Chức vụ: {position} </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Ngày sinh</p>
            <p> {moment(dateOfBirth).format("DD-MM-YYYY")} </p>
          </div>
          <div>
            <p className="font-semibold">Giới tính</p>
            <p>{gender} </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold ">Địa chỉ</p>
            <p>{address} </p>
          </div>
          <div>
            <p className="font-semibold">Số điện thoại</p>
            <p>{phoneNumber} </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Phòng ban</p>
            <p>
              {department?.departmentName ? department.departmentName : "No"}{" "}
            </p>
          </div>
          <div>
            <p className="font-semibold">Mức lương</p>
            <p>
              {" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(salary.baseSalary)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Ngày bắt đầu làm việc</p>
            <p>{moment(startDate).format("DD-MM-YYYY")} </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-2">
        <Link to={`/employee/edit/${_id}`} className="w-1/2">
          <button className="btn btn-secondary w-full">
            Chỉnh sửa thông tin
          </button>
        </Link>
        <Link to={`/employee/salary/update/${_id}`} className="w-1/2">
          <button className="btn btn-success w-full">Chỉnh sửa lương</button>
        </Link>
      </div>
    </div>
  );
};

export default EmployeeProfile;
