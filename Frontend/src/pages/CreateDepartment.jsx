import React, { useState } from "react";
import { Form, redirect, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";

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
        const res = await customFetch.get("/employee", {
          params: {
            notBelongDepartment: true,
          },
        });

        console.log(res);
        if (res.data.code == 404) {
          toast.warning(
            "Không có nhân viên nào có sẵn bạn cần tạo 1 nhân viên trước!"
          );
          return redirect("/employee/create");
        }

        return {
          employees: res.data.data,
        };
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.error?.message || "There was an error";
        toast.error(errorMessage);
        if (error?.response?.status === 401 || 403) {
          return redirect("/login");
        }
      }

      return null;
    };

export const action =
  (store) =>
    async ({ request }) => {
      const formData = await request.formData();
      const data = Object.fromEntries(formData);

      const employeeValues = Object.keys(data)
        .filter((key) => key.startsWith("employee")) // Lọc các thuộc tính bắt đầu bằng 'employee'
        .map((key) => data[key]);

      if (data.departmentName.trim().length < 1) {
        toast.error("Tên phòng ban phải có ít nhất 1 chữ cái");
        return redirect("/department/create");
      }
      try {
        const res = await customFetch.post("/department/create", {
          departmentName: data.departmentName,
          manager: data.manager,
          employees: employeeValues,
        });

        toast.success("Tạo phòng ban thành công");
        return redirect("/");
      } catch (error) {
        const errorMessage = error?.response?.data.message;
        console.log(error);
        toast.error(errorMessage);
        if (error.response.status === 401 || 403) {
          return redirect("/login");
        }
      }

      return null;
    };

const CreateDepartment = () => {
  const { employees } = useLoaderData();

  const [listEmployees, setListEmployees] = useState(employees);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-orange-600">
        Tạo phòng ban mới
      </h2>

      <Form method="post">
        {/* Tên phòng ban */}
        <div className="mb-6">
          <label
            htmlFor="departmentName"
            className="block text-lg font-semibold"
          >
            Tên phòng ban
          </label>
          <input
            id="departmentName"
            type="text"
            name="departmentName"
            className="input input-bordered w-full"
            placeholder="Nhập tên phòng ban"
            required
          />
        </div>

        {/* Chọn người làm quản lý */}
        <div className="mb-6">
          <label htmlFor="manager" className="block text-lg font-semibold">
            Chọn quản lý phòng ban
          </label>
          <select
            id="manager"
            name="manager"
            className="select select-bordered w-full"
            required
          >
            <option value="">Chọn quản lý</option>
            {listEmployees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                Name: {employee.fullName} Phone: {employee.phoneNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Danh sách nhân viên */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Chọn nhân viên vào phòng ban
          </label>
          {listEmployees.map((employee) => (
            <div
              key={employee._id}
              className="flex items-center mb-2 space-x-4"
            >
              {/* Ảnh nhân viên */}
              <img
                src={
                  employee.avatar ??
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGXOWxQl47sqmnDLNjD8gxyfxIS8MF5C18mQ&s"
                }
                alt={employee.fullName}
                className="w-12 h-12 rounded-full border-2 border-primary object-cover"
              />
              <input
                type="checkbox"
                id={`employee-${employee._id}`}
                value={employee._id}
                name={`employee_${employee._id}`}
                className="checkbox checkbox-primary bg-black"
              />
              <div className="flex justify-around gap-2">
                <label
                  htmlFor={`employee-${employee._id}`}
                  className="font-black"
                >
                  {employee.fullName}
                </label>
                <label
                  htmlFor={`employee-${employee._id}`}
                  className="font-bold"
                >
                  {employee.address}
                </label>
                <label
                  htmlFor={`employee-${employee._id}`}
                  className="font-extralight"
                >
                  {employee.phoneNumber}
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Nút gửi */}
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary bg-black text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Tạo phòng ban
          </button>
        </div>
      </Form>
    </div>
  );
};

export default CreateDepartment;
