import React, { useState, useEffect } from "react";
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import { salarySchema } from "../dto/salary/salary-update.dto";
import Swal from "sweetalert2";

/**
 * ====================================
 * loader
 * ====================================
 */

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

      const resSub = await customFetch.get(`employee/${id}/subSalary`);
      const { bonus, punish, totalHoursWork, totalSalary } = resSub.data;

      return {
        employee: res.data.data,
        bonus,
        punish,
        totalHoursWork,
        totalSalary,
        id,
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

/**
 * ====================================
 * action
 * ====================================
 */
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const { id } = params;
  const data = Object.fromEntries(formData);

  const validData = salarySchema.safeParse(data);

  if (!validData.success) {
    const errors = validData.error.format();

    // Hiển thị tất cả lỗi bằng toast
    Object.entries(errors).forEach(([field, messages]) => {
      if (messages && messages._errors) {
        // Kiểm tra nếu _errors tồn tại
        messages._errors.forEach((message) => {
          toast.error(`${field}: ${message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
      }
    });
  }

  try {
    await customFetch.patch(`/employee/${id}/salary/update`, {
      ...validData.data,
    });

    toast.success("Cập nhật lương thành công");
  } catch (error) {
    console.log(error);
    const errorMessage = error?.response?.message || "There was an error";
    toast.error(errorMessage);
    if (error?.response?.status === 401 || 403) {
      return redirect("/login");
    }
  }

  return null;
};

const EditSalary = () => {
  const { employee, bonus, totalHoursWork, totalSalary, id } = useLoaderData();
  const navigate = useNavigate();
  const textSalary =
    Math.floor(totalHoursWork / 60) + " giờ " + (totalHoursWork % 60) + " phút";

  const salary = employee.salary;

  function handleSalaryPayment() {
    Swal.fire({
      title: "Bạn có chắc chắn muốn trả lương?",
      text: "Việc này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // /employee/:id/salary/payment
        const res = await customFetch.post(`employee/${id}/salary/payment`);
        navigate(`/employee/${id}/salary/history`);
        if (res.data.code == 400) {
          Swal.fire("Thất bại!", res.data.message, "error");
        } else {
          Swal.fire("Thành công!", "Trả lương thành công!", "success");
        }
      }
    });
  }

  // State để lưu trữ thông tin lương
  const [salaryData, setSalaryData] = useState(salary);

  // Tính toán lại tổng lương khi thay đổi các giá trị
  useEffect(() => {
    setSalaryData((prev) => ({
      ...prev,
      totalSalary: prev.baseSalary + prev.bonuses - prev.deductions,
    }));
  }, [salaryData.baseSalary, salaryData.bonuses, salaryData.deductions]);

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-orange-600">
        Chỉnh sửa lương nhân viên: {employee.fullName}
      </h2>

      <Form method="post" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lương cơ bản */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <label
            htmlFor="baseSalary"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Lương cơ bản
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="baseSalary"
              name="baseSalary"
              type="number"
              min={1}
              className="input input-bordered w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={salaryData.baseSalary}
              onChange={handleChange}
              required
            />
            <p className="text-lg font-medium text-blue-600 w-1/3">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(salaryData.baseSalary)}
            </p>
          </div>
        </div>

        {/* Thưởng */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <label
            htmlFor="bonuses"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Thưởng
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="bonuses"
              name="bonuses"
              type="number"
              min="0"
              className="input input-bordered w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={salaryData.bonuses}
              onChange={handleChange}
            />
            <p className="text-lg font-medium text-green-600 w-1/3">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(salaryData.bonuses)}
            </p>
          </div>
        </div>

        {/* Khấu trừ */}

        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <label
            htmlFor="deductions"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Khấu trừ
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="deductions"
              name="deductions"
              type="number"
              min="0"
              className="input input-bordered w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={salaryData.deductions}
              onChange={handleChange}
            />
            <p className="text-lg font-medium text-red-600 w-1/3">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(salaryData.deductions)}
            </p>
          </div>
        </div>

        {/* Tổng lương */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <label
            htmlFor="totalSalary"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Tổng lương (Chưa tính làm thêm giờ)
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="totalSalary"
              name="totalSalary"
              type="number"
              className="input input-bordered w-2/3 bg-gray-100 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              value={salaryData.totalSalary}
              readOnly
            />
            <p className="text-lg font-medium text-gray-600 w-1/3">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(salaryData.totalSalary)}
            </p>
          </div>
        </div>

        {/* overtime */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md col-span-full ">
          <label className="block text-lg font-semibold text-center text-gray-700 mb-2">
            Tổng giờ làm đến nay: {textSalary} / 160H
          </label>
          <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">
            Tổng tiền làm thêm giờ hiện tại:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(bonus)}
          </label>
          <label className="block text-lg text-center font-semibold text-gray-700 mb-2">
            Lương thanh toán hiện tại:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalSalary)}
          </label>
        </div>

        {/* Nút lưu */}
        <div className="col-span-2 text-center">
          <button
            type="submit"
            className="btn btn-block btn-secondary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Lưu thay đổi
          </button>
        </div>
      </Form>

      {/* Nút trả lương */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={handleSalaryPayment}
          className="btn btn-success btn-block text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 mb-5"
        >
          Trả lương
        </button>

        <Link
          to={`/employee/${id}/salary/history`}
          type="button"
          className="btn btn-warning btn-block text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
        >
          Lịch sử nhận lương
        </Link>
      </div>
    </div>
  );
};

export default EditSalary;
