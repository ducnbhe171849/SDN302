import React from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import Swal from "sweetalert2";

export const loader =
  (store) =>
  async ({ params }) => {
    const { id } = params;
    const { userState } = store.getState();

    if (!userState?.user) {
      toast.warn("Please login first");
      return redirect("/login");
    }

    if (userState.user?.role !== "Admin") {
      toast.error("Forbidden resource");
      return redirect("/login");
    }

    try {
      const res = await customFetch.get("/department/" + id);

      return {
        employees: res.data.data.employees,
        manager: res.data.data.manager,
        departmentName: res.data.data.departmentName,
        totalEmployees: res.data.data.employees.length, // Tính tổng số nhân viên
        id: id,
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

const DepartmentEmployees = () => {
  const { employees, departmentName, manager, totalEmployees, id } =
    useLoaderData();
  const navigate = useNavigate();

  const handleDelete = async () => {
    Swal.fire({
      title: `Xóa phòng ban "${departmentName}"?`,
      text: "Bạn sẽ không thể khôi phục phòng ban này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa ngay!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await customFetch.delete(`/department/${id}`);
          Swal.fire("Đã xóa!", "Phòng ban đã bị xóa thành công.", "success");
          navigate("/");
        } catch (error) {
          Swal.fire("Lỗi!", "Không thể xóa phòng ban.", "error");
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* 🏢 Thông tin phòng ban */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-orange-600">
          Phòng ban: {departmentName}
        </h2>
        <p className="text-lg text-gray-600">
          Tổng số nhân viên: {totalEmployees}
        </p>
      </div>

      {/* Các nút thao tác */}
      <div className="flex justify-center space-x-4 mb-6">
        {/* 🏢 Nút thêm nhân viên */}
        <Link to={`/department/${id}/employees/add`}>
          <button className="btn btn-warning text-black py-2 px-4 rounded-md hover:bg-blue-700 hover:text-white transition duration-200">
            Thêm nhân viên mới
          </button>
        </Link>

        {/* 📝 Nút sửa thông tin phòng ban */}
        <Link to={`/department/update/${id}`}>
          <button className="btn btn-secondary py-2 px-4 rounded-md hover:bg-gray-700 hover:text-white transition duration-200">
            Sửa phòng ban
          </button>
        </Link>

        <Link to={`/department/statistic/${id}`}>
          <button className="btn btn-success py-2 px-4 rounded-md hover:bg-gray-700 hover:text-white transition duration-200">
            Thống kê
          </button>
        </Link>

        {/* 🗑️ Nút xóa phòng ban */}
        <button
          onClick={handleDelete}
          className="btn btn-error py-2 px-4 rounded-md hover:bg-red-700 hover:text-white transition duration-200"
        >
          Xóa phòng ban
        </button>
      </div>

      {/* Danh sách nhân viên */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {employees.map(
          ({ _id, avatar, fullName, phoneNumber, address, position }) => (
            <Link to={`/employee/${_id}`} key={_id} className="flex">
              <div
                className={`card ${
                  position.toLowerCase().trim() == "manager"
                    ? "bg-red-400"
                    : "bg-base-100"
                } shadow-xl flex-1 flex flex-col`}
              >
                <figure className="flex justify-center p-4">
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-24 h-24 rounded-full border-4 border-primary object-cover"
                  />
                </figure>
                <div className="card-body text-center flex-1">
                  <h3 className="text-xl font-semibold">Tên: {fullName}</h3>
                  <p className="text-gray-600">Địa chỉ: {address}</p>
                  <p className="text-gray-600">Phone: {phoneNumber}</p>
                  <p className="text-gray-600">Vị trí: {position}</p>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default DepartmentEmployees;
