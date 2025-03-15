import React, { useState } from "react";
import { customFetch } from "../utils/customAxios";
import { toast } from "react-toastify";
import { Link, redirect, useLoaderData } from "react-router-dom";

export const loader =
  (store) =>
  async ({ request }) => {
    const { userState } = store.getState();
    const requestURL = new URL(request.url);
    const params = Object.fromEntries([...requestURL.searchParams.entries()]);

    if (!userState?.user) {
      toast.warn("Please login first");
      return redirect("/login");
    }

    if (userState.user?.role != "Admin") {
      toast.error("Forbidden resource");
      return redirect("/login");
    }

    try {
      const res = await customFetch.get("/attendance/statistic", {
        params,
      });

      return {
        listAttendance: res.data.data,
        meta: params,
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

const AttendanceManager = () => {
  const { listAttendance, meta } = useLoaderData();
  const [selectedMonth, setSelectedMonth] = useState(
    meta.month ?? new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(
    meta.year ?? new Date().getFullYear()
  );

  const [employees, setEmployees] = useState(listAttendance);

  const filteredEmployees = employees;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý chấm công</h1>

      <div className="flex space-x-4 mb-4">
        <select
          className="select select-bordered"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(parseInt(e.target.value));

            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);

            params.set("month", e.target.value);

            window.location.search = params.toString();
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(parseInt(e.target.value));
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);

            params.set("year", e.target.value);

            window.location.search = params.toString();
          }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={2025 - i}>
              {2025 - i}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Ảnh</th>
              <th className="p-2 border">Tên nhân viên</th>
              <th className="p-2 border">Phòng ban</th>
              <th className="p-2 border">Số ngày công</th>
              <th className="p-2 border">Số ngày nghỉ</th>
              <th className="p-2 border">Giờ làm thêm</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map(
                ({
                  totalPresent,
                  totalAbsent,

                  totalOverTime,
                  employeeId,
                  fullName,

                  department,
                  avatar,
                }) => (
                  <tr key={employeeId}>
                    <td className="p-2 border">
                      <Link to={`/employee/` + employeeId}>
                        <img
                          src={avatar}
                          alt={fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </Link>
                    </td>
                    <td className="p-2 border">{fullName}</td>
                    <td className="p-2 border">{department}</td>
                    <td className="p-2 border">{totalPresent}</td>
                    <td className="p-2 border">{totalAbsent}</td>
                    <td className="p-2 border">
                      {Math.floor(parseInt(totalOverTime) / 60) +
                        " giờ " +
                        (totalOverTime % 60) +
                        " phút"}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceManager;
