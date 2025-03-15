import React, { useState } from "react";
import { Link, redirect, useLoaderData, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import moment from "moment";
import { Filters } from "../components";
import Swal from "sweetalert2";

export const loader =
  (store) =>
  async ({ request }) => {
    // create a object request from a string
    const requestURL = new URL(request.url);

    //  get all search params convert to array first and finally convert to an object
    const params = Object.fromEntries([...requestURL.searchParams.entries()]);

    // console.log(data);
    const { userState } = store.getState();

    if (!userState?.user) {
      toast.warn("Please login first");
      return redirect("/login");
    }

    if (userState.user?.role != "Admin") {
      toast.error("Forbidden resource");
      return redirect("/login");
    }

    let listDepartments = [];

    try {
      const resDepartment = await customFetch.get("/department");
      listDepartments = resDepartment.data.data;
      const res = await customFetch.get("/employee", {
        params: params,
      });

      return {
        listEmployees: res.data.data,
        listDepartments: listDepartments,
        meta: params,
      };
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.code == 404) {
        return {
          listEmployees: [],
          listDepartments: listDepartments,
          meta: params,
        };
      }
      const errorMessage =
        error?.response?.data?.error?.message || "There was an error";
      toast.error(errorMessage);
    }
    return null;
  };

const Employees = () => {
  const { listEmployees } = useLoaderData();

  const [employees, setEmployees] = useState(listEmployees);

  const handleSearch = (search) => {
    search = search.trim().toLowerCase();
    const newEmployees = listEmployees.filter((item) => {
      console.log(item.fullName.toLowerCase());
      if (
        item.fullName.toLowerCase().includes(search) ||
        item.position.toLowerCase().includes(search) ||
        item?.department?.departmentName.toLowerCase().includes(search)
      ) {
        return item;
      }
    });
    setEmployees(newEmployees);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xoá nhân viên này?",
      text: "Việc này sẽ không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Code để thực hiện việc xoá nhân viên
        Swal.fire("Đã xoá!", "Nhân viên đã được xoá thành công.", "success");
        const newListEmployees = employees.filter((item) => {
          return item._id != id;
        });
        setEmployees(newListEmployees);

        await customFetch.delete("employee/" + id);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-orange-600">
        Danh sách nhân viên
      </h2>

      {/* Thanh tìm kiếm và bộ lọc */}
      <Filters set={handleSearch}></Filters>

      {/* Nút "Create Employee" */}
      <div className="text-center mb-6 mt-6">
        <Link to="/employee/create">
          <button className="btn btn-success text-black py-2 px-4 rounded-md hover:bg-blue-700 hover:text-white transition duration-200">
            Tạo nhân viên mới
          </button>
        </Link>
      </div>

      {/* Danh sách nhân viên */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {employees ? (
          employees.map(
            ({
              _id,
              avatar,
              fullName,
              gender,
              phoneNumber,
              dateOfBirth,
              salary,
            }) => (
              <div
                key={_id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl h-full flex flex-col"
              >
                <Link to={`/employee/${_id}`} className="h-full">
                  {/* Ảnh */}
                  <figure className="flex justify-center p-4">
                    <img
                      src={avatar}
                      alt={fullName}
                      className="w-24 h-24 rounded-full border-4 border-primary object-cover"
                    />
                  </figure>

                  {/* Nội dung */}
                  <div className="card-body text-center flex flex-col flex-grow justify-between">
                    <h3 className="text-xl font-semibold">name: {fullName}</h3>
                    <p className="text-gray-600">gender: {gender}</p>
                    <p className="text-gray-600">phone: {phoneNumber}</p>
                    <p className="text-gray-600">
                      Salary: {salary?.baseSalary}
                    </p>
                    <p className="text-gray-600">
                      Dob: {moment(dateOfBirth).format("DD-MM-YYYY")}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleDelete(_id);
                  }}
                  className="btn btn-error"
                >
                  Delete
                </button>
              </div>
            )
          )
        ) : (
          <h1>Không có nhân viên nào</h1>
        )}
      </div>
    </div>
  );
};

export default Employees;
