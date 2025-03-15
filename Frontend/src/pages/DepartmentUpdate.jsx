import React, { useState } from "react";
import { Link, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
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

const EditDepartment = () => {
  const { employees, departmentName, totalEmployees, id } = useLoaderData();

  const navigate = useNavigate();
  const [name, setName] = useState(departmentName);
  const [listEmployees, setEmployees] = useState(employees);

  // Xử lý xóa nhân viên
  const handleRemoveEmployee = (employeeId) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa nhân viên này?",
      text: "Bạn sẽ không thể khôi phục lại sau khi xóa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Thực hiện xóa nhân viên tại đây (gọi API hoặc logic của bạn)
        console.log("Nhân viên đã bị xóa:", employeeId);

        // Ví dụ gọi API xóa
        // removeEmployeeApiCall(employeeId);

        await customFetch.patch("/department/employee/delete/" + id, {
          employeeId: employeeId,
        });

        const newEmployees = employees.filter((item) => {
          return item._id != employeeId;
        });

        setEmployees(newEmployees);

        Swal.fire("Đã xóa!", "Nhân viên đã bị xóa khỏi hệ thống.", "success");
        navigate("/department/update/" + id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Hủy bỏ", "Nhân viên không bị xóa.", "info");
      }
    });
  };

  const handleName = async () => {
    if (name.length === 0 || name.trim() === "") {
      toast.error("Tên phải có ít nhất 1 chũ cái");
      return;
    }

    if (name.length > 100) {
      toast.error("Tên không dài quá 100 chữ cái");
      return;
    }

    try {
      await customFetch.patch("/department/" + id, {
        departmentName: name,
      });

      toast.success("Cập nhật thành công");
    } catch (error) {}
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* 🏢 Phần tiêu đề */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-orange-600">
          Chỉnh sửa phòng ban: {departmentName}
        </h2>
        <p className="text-lg text-gray-600">
          Tổng số nhân viên: {totalEmployees}
        </p>
      </div>

      {/* 🛠️ Form cập nhật */}
      <div className="space-y-4">
        {/* 🔹 Chỉnh sửa tên phòng ban */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
          <button
            className="btn btn-secondary px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={handleName}
          >
            Cập nhật tên
          </button>
        </div>
      </div>

      {/* 📌 Danh sách nhân viên */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Danh sách nhân viên</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listEmployees.length == 0 ? (
            <div className="col-span-12 flex justify-center items-center">
              <Link to={`/department/${id}/employees/add`}>
                <button className="btn btn-primary text-black py-2 px-4 rounded-md hover:bg-blue-700 hover:text-white transition duration-200">
                  Thêm nhân viên mới
                </button>
              </Link>
            </div>
          ) : (
            <>
              {listEmployees.map(
                ({ _id, fullName, phoneNumber, address, position, avatar }) => (
                  <div
                    key={_id}
                    className="card bg-base-100 shadow-xl h-full flex flex-col"
                  >
                    <Link to={`/employee/${_id}`} className="flex-1">
                      <figure className="flex justify-center p-4">
                        <img
                          src={
                            avatar ??
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGXOWxQl47sqmnDLNjD8gxyfxIS8MF5C18mQ&s"
                          }
                          alt={fullName}
                          className="w-24 h-24 rounded-full border-4 border-primary object-cover"
                        />
                      </figure>
                    </Link>

                    <div className="card-body text-center flex-1">
                      <Link to={`/employee/${_id}`} className="flex-1">
                        <h3 className="text-xl font-semibold">{fullName}</h3>
                        <p className="text-gray-600">{address}</p>
                        <p className="text-gray-600">{phoneNumber}</p>
                        <p className="text-gray-600">{position}</p>
                      </Link>

                      <button
                        onClick={() => handleRemoveEmployee(_id)}
                        className="btn btn-error btn-sm mt-2"
                      >
                        Xóa khỏi phòng ban
                      </button>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;
