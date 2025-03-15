import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { redirect } from "react-router-dom";
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
      const res = await customFetch.get("/department");
      console.log(res);
      return {
        departments: res.data.data,
      };
    } catch (error) {
      console.log(error);
      const errorMessage = "Please login first";
      toast.error(errorMessage);
      if (error?.response?.status === 401 || 403) {
        return redirect("/login");
      }
    }

    return null;
  };

const Department = () => {
  const { departments } = useLoaderData();

  const data = useLoaderData();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-orange-600">
        Danh sách các phòng ban
      </h2>

      <div className="text-center mb-6">
        <Link to={"/department/create"}>
          <button className="btn btn-primary text-black py-2 px-4 rounded-3xl border-8 hover:bg-blue-700 hover:text-white transition duration-200 relative top-0 right-0">
            Tạo phòng ban
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {departments.map(({ _id, departmentName }) => (
          <div key={_id} className="flex justify-center">
            <Link
              to={`/department/${_id}/employees`}
              className="text-xl text-blue-500 hover:text-blue-700 transition duration-200"
            >
              {departmentName}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Department;
