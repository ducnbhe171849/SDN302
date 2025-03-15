import React, { useState } from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import moment from "moment";
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
      const res = await customFetch.get("/employee", {
        params: {
          notBelongDepartment: true,
        },
      });

      return {
        employees: res.data.data,
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

const AddEmployee = () => {
  // State để lưu trữ thông tin người dùng chọn

  const { employees, id } = useLoaderData();

  const [listEmployees, setListEmployees] = useState(employees);

  const handleAddEmployee = (employeeId) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn thêm viên này?",

      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(employeeId);

        const newEmployees = listEmployees.filter((item) => {
          return item._id != employeeId;
        });

        const res = await customFetch.patch(`/department/${id}/employee/add`, {
          employeeId: employeeId,
        });

        console.log(res);

        setListEmployees(newEmployees);

        Swal.fire("Thành công!", "Nhân viên đã thêm vào hệ thống.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Hủy bỏ", "Nhân viên không được thêm.", "info");
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-orange-600">
        Thêm nhân viên vào phòng ban
      </h2>

      {/* Chọn nhân viên */}

      <div className="mb-4">
        <label className="block text-lg font-semibold">Chọn nhân viên</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
          {listEmployees.map(
            ({ _id, fullName, phoneNumber, address, position, avatar }) => (
              <div
                key={_id}
                className="card bg-base-100 shadow-xl h-full flex flex-col"
              >
                <Link to={`/employee/${_id}`} className="flex-1">
                  <figure className="flex justify-center p-4">
                    <img
                      src={avatar}
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
                    className="btn btn-success btn-sm mt-2"
                    onClick={() => {
                      handleAddEmployee(_id);
                    }}
                  >
                    Thêm nhân viên
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
