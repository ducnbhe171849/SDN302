import React from "react";
import { redirect, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";

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
      const res = await customFetch.get(`employee/${id}/salary/history`);

      return {
        history: res.data.data,
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

const SalaryHistory = () => {
  const { history } = useLoaderData();
  console.log(history);
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Lịch sử trả lương</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          {/* Header Table */}
          <thead>
            <tr>
              <th>Ngày trả</th>
              <th>Tổng Lương</th>
              <th>Khấu trừ</th>
              <th>Tiền Thưởng</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {history.map((item) => (
              <tr key={item._id}>
                <td>{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                <td>
                  {item.total.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
                <td>
                  {item.deductions.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
                <td>
                  {item.bonus.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryHistory;
