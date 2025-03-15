import React, { useState } from "react";
import FormInput from "./FormInput";
import { Form, Link, useLoaderData } from "react-router-dom";
import FormSelect from "./FormSelect";
import FormRange from "./FormRange";
import { AiOutlineDownload } from "react-icons/ai"; // Import icon từ react-icons
import moment from "moment";
import Swal from "sweetalert2";
import { customFetch } from "../utils/customAxios";
const Filters = ({ set }) => {
  // const { meta, params } = useLoaderData();

  // const { search, price, category, company, order, shipping } = params;

  const { listDepartments, meta } = useLoaderData();
  const { department, gender, maxSalary, search, startDate } = meta;

  // Hàm hiển thị Swal khi nhấn nút Backup
  const handleBackup = () => {
    Swal.fire({
      title: "Bạn có muốn sao lưu?",
      text: "Bạn có muốn lưu dữ liệu sao lưu?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đúng",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Sao lưu thành công!",
          "Dữ liệu của bạn đã được sao lưu.",
          "success"
        );

        await customFetch.get("/backup");
      }
    });
  };

  // Hàm hiển thị Swal khi nhấn nút Restore
  const handleRestore = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Bạn có muốn phục hồi dữ liệu không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Phục hồi thành công!",
          "Dữ liệu của bạn đã được khôi phục thành công.",
          "success"
        );
        await customFetch.get("/backup/restore");
      }
    });
  };

  const [gen, setGender] = useState(gender ?? "all");

  return (
    <Form
      className="bg-base-200 rounded-md px-8 py-4 grid
      gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center"
    >
      {/* search */}
      <FormInput
        label={"search"}
        name={"search"}
        type={"search"}
        size={"input-sm"}
        defaultValue={search ?? ""}
        set={set}
      ></FormInput>

      <FormSelect
        label={"department"}
        name={"department"}
        size={"select-sm"}
        defaultValue={department ?? "all"}
        list={listDepartments}
      ></FormSelect>

      <FormRange
        name={"maxSalary"}
        label={"select salary"}
        size={"range-sm"}
        selectPrice={maxSalary ? parseInt(maxSalary) : 0}
      ></FormRange>

      {/* gender */}
      <div className="form-control">
        <label htmlFor="gender" className="label">
          <span className="label-text capitalize">Giới tính</span>
        </label>

        <select
          className="select select-sm select-bordered"
          name="gender"
          id="gender"
          value={gen}
          onChange={(e) => {
            setGender(e.target.value);
          }}
        >
          <option value="all">Chọn giới tính</option>
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
        </select>
      </div>

      {/* date */}
      <div className="form-control mb-5">
        <label htmlFor="startDate" className="label">
          <span className="label-text capitalize">Ngày bắt đầu làm việc</span>
        </label>

        <input
          type="date"
          id="startDate"
          name="startDate"
          defaultValue={startDate ? moment(startDate).format("YYYY-MM-DD") : ""}
          className="input input-sm input-bordered"
        />
      </div>

      {/* buttons */}
      <button type="submit" className="btn btn-primary btn-sm">
        Submit
      </button>
      <Link to={"/employee"} className="btn btn-accent btn-sm">
        Reset
      </Link>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="submit"
          onClick={handleBackup}
          className="btn btn-warning btn-sm"
        >
          Backup
        </button>
        <button
          type="submit"
          onClick={handleRestore}
          className="btn btn-success btn-sm"
        >
          Restore
        </button>
      </div>
    </Form>
  );
};

export default Filters;
