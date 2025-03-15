import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro"; // Import html2canvas-pro thay vì html2canvas
import { toast } from "react-toastify";
import { redirect, useLoaderData } from "react-router-dom";
import { customFetch } from "../utils/customAxios";

export const loader =
  (store) =>
  async ({ request, params }) => {
    const { id } = params;

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
      // [GET] /department/statistic/:id
      const res = await customFetch.get("/department/statistic/" + id);

      const { departmentName, genderStats, positionStats, totalEmployees } =
        res.data;

      return {
        departmentName,
        genderStats,
        positionStats,
        totalEmployees,
      };
    } catch (error) {
      console.log(error);
      const errorMessage = error?.response?.message;
      toast.error(errorMessage);
      if (error?.response?.status === 401 || 403) {
        return redirect("/login");
      }
    }

    return null;
  };

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DepartmentStatistic = () => {
  const data = useLoaderData();
  console.log(data);
  const { departmentName, genderStats, positionStats, totalEmployees } = data;
  const employees = [
    {
      name: "Alice",
      department: "Marketing",
      role: "Manager",
      gender: "Female",
    },
    { name: "Bob", department: "IT", role: "Developer", gender: "Male" },
    {
      name: "Charlie",
      department: "Marketing",
      role: "Designer",
      gender: "Male",
    },
    { name: "Diana", department: "HR", role: "Recruiter", gender: "Female" },
    { name: "Eve", department: "IT", role: "Manager", gender: "Female" },
    { name: "Frank", department: "HR", role: "Manager", gender: "Male" },
  ];

  // Tính toán số lượng theo phòng ban
  const countByDepartment = (department) => {
    return employees.filter((employee) => employee.department === department)
      .length;
  };

  // Tính toán số lượng theo chức vụ
  const countByRole = (role) => {
    return employees.filter((employee) => employee.role === role).length;
  };

  // Tính toán số lượng theo giới tính
  const countByGender = (gender) => {
    return employees.filter((employee) => employee.gender === gender).length;
  };

  // Cấu hình dữ liệu cho biểu đồ
  const departmentData = {
    labels: ["Marketing", "IT", "HR"],
    datasets: [
      {
        label: "Số lượng nhân viên",
        data: [
          countByDepartment("Marketing"),
          countByDepartment("IT"),
          countByDepartment("HR"),
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Chuyển từ OKLCH sang RGBA
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const roleLabels = positionStats.map((item) => {
    return item.position;
  });

  const quantityRole = positionStats.map((item) => {
    return item.employeeCount;
  });

  const roleData = {
    labels: roleLabels,
    datasets: [
      {
        label: "Số lượng nhân viên",
        data: quantityRole,
        backgroundColor: "rgba(153, 102, 255, 0.2)", // Chuyển từ OKLCH sang RGBA
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const genderData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Số lượng nhân viên",
        data: [
          genderStats[0]?.employeeCount ?? 0,
          genderStats[1]?.employeeCount ?? 0,
        ],
        backgroundColor: "rgba(255, 159, 64, 0.2)", // Chuyển từ OKLCH sang RGBA
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Hàm để tải xuống PDF
  const downloadPDF = () => {
    const input = document.getElementById("charts-container");

    html2canvas(input).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10, 200, 60);
      pdf.save(`department-${departmentName}-statistics.pdf`);
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold text-center text-gray-700">
        Thống kê nhân viên: {departmentName}
      </h2>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        id="charts-container"
      >
        {/* Biểu đồ phòng ban */}
        {/* <div className="card bg-white shadow-lg rounded-lg border-t-4 border-blue-500">
          <div className="card-body p-4">
            <h3 className="card-title text-xl font-bold text-gray-700">
              Phòng ban
            </h3>
            <Bar data={departmentData} />
          </div>
        </div> */}

        {/* Biểu đồ chức vụ */}
        <div className="card bg-white shadow-lg rounded-lg border-t-4 border-green-500">
          <div className="card-body p-4">
            <h3 className="card-title text-xl font-bold text-gray-700">
              Chức vụ
            </h3>
            <Bar
              data={roleData}
              options={{
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1,
                    },
                    max: totalEmployees,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Biểu đồ giới tính */}
        <div className="card bg-white shadow-lg rounded-lg border-t-4 border-pink-500">
          <div className="card-body p-4">
            <h3 className="card-title text-xl font-bold text-gray-700">
              Giới tính
            </h3>
            <Bar
              data={genderData}
              options={{
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1,
                    },
                    max: totalEmployees,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Nút tải PDF */}
      <div className="text-center mt-6">
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          Tải xuống PDF
        </button>
      </div>
    </div>
  );
};

export default DepartmentStatistic;
