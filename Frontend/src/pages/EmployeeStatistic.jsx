import React, { useEffect, useState } from "react";
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

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Loader để lấy dữ liệu
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
        const res = await customFetch.get("/department/statistics/all");

        return {
          data: res.data.data,
          totalEmployees: res.data.totalEmployees,
        };
      } catch (error) {
        console.log(error);
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
        if (error?.response?.status === 401 || 403) {
          return redirect("/");
        }
      }

      return null;
    };

const EmployeeStatistic = () => {
  const { data, totalEmployees } = useLoaderData();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  let departmentLabels = [];
  let positionArr = [];
  let gender = {
    male: 0,
    female: 0,
  };

  data.forEach((item) => {
    departmentLabels.push(item.departmentName);
    positionArr.push(item.positionStats);

    gender.male +=
      item?.genderStats[0]?.gender == "Male"
        ? parseInt(item?.genderStats[0]?.employeeCount)
        : 0;
    gender.male +=
      item?.genderStats[1]?.gender == "Male"
        ? parseInt(item?.genderStats[1]?.employeeCount)
        : 0;
    gender.female +=
      item?.genderStats[0]?.gender == "Female"
        ? parseInt(item?.genderStats[0]?.employeeCount)
        : 0;
    gender.female +=
      item?.genderStats[1]?.gender == "Female"
        ? parseInt(item?.genderStats[1]?.employeeCount)
        : 0;
  });

  const departmentData = {
    labels: departmentLabels,
    datasets: [
      {
        label: "Số lượng nhân viên",
        data: data.map((item) => {
          return item.totalEmployees;
        }),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const positionData = positionArr.flat().reduce((acc, current) => {
    const existing = acc.find(
      (item) =>
        item.position.trim().toLowerCase() ===
        current.position.trim().toLowerCase()
    );
    if (existing) {
      existing.employeeCount += current.employeeCount;
    } else {
      acc.push({
        position: current.position,
        employeeCount: current.employeeCount,
      });
    }
    return acc;
  }, []);

  const roleData = {
    labels: positionData.map((item) => item.position),
    datasets: [
      {
        label: "Số lượng nhân viên",
        data: positionData.map((item) => item.employeeCount),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
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
        data: [gender.male, gender.female],
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const [monthlyData, setMonthlyData] = useState([]);
  const [quarterlyData, setQuarterlyData] = useState([]);

  // Fake data cho tổng lương theo tháng và theo quý
  const fakeMonthlyData = [
    { month: 1, totalSalary: 1500000 },
    { month: 2, totalSalary: 1450000 },
    { month: 3, totalSalary: 1600000 },
    { month: 4, totalSalary: 1550000 },
    { month: 5, totalSalary: 1580000 },
    { month: 6, totalSalary: 1620000 },
    { month: 7, totalSalary: 1650000 },
    { month: 8, totalSalary: 1590000 },
    { month: 9, totalSalary: 1700000 },
    { month: 10, totalSalary: 1800000 },
    { month: 11, totalSalary: 1750000 },
    { month: 12, totalSalary: 1850000 },
  ];

  const fakeQuarterlyData = [
    { quarter: 1, totalSalary: 4500000 },
    { quarter: 2, totalSalary: 4800000 },
    { quarter: 3, totalSalary: 5100000 },
    { quarter: 4, totalSalary: 5300000 },
  ];

  // Dữ liệu cho biểu đồ tháng
  const monthlyChartData = {
    labels: monthlyData.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: "Tổng lương",
        data: monthlyData.map((item) => item.totalSalary),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ quý
  const quarterlyChartData = {
    labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
    datasets: [
      {
        label: "Tổng lương",
        data: quarterlyData.map((item) => item.totalSalary),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    // Fake API call để lấy dữ liệu
    const fetchData = async () => {
      // Set dữ liệu giả vào state
      const res = await customFetch.get("/employee/salary/statistic/" + year);
      const { monthlyStats, quarterlyStats } = res.data;

      setMonthlyData(monthlyStats);
      setQuarterlyData(quarterlyStats);
    };

    fetchData();
  }, [year]);

  const handleChangeYear = (e) => {
    setYear(e.target.value);
  };

  const downloadPDF = () => {
    const input = document.getElementById("charts-container");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4"); // A4 portrait
      const imgData = canvas.toDataURL("image/png");

      // Lấy kích thước của trang A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Tính toán chiều cao của ảnh
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yOffset = 0;

      // Nếu chiều cao ảnh lớn hơn chiều cao của trang, chia thành nhiều trang
      while (yOffset < imgHeight) {
        pdf.addImage(imgData, "PNG", 0, -yOffset, imgWidth, imgHeight);
        yOffset += pageHeight;

        // Nếu còn phần dư, thêm một trang mới
        if (yOffset < imgHeight) {
          pdf.addPage();
        }
      }

      pdf.save("department-statistics.pdf");
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 rounded-lg shadow-xl">
      <div
        id="charts-container"
        className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6"
      >
        {" "}
        <h2 className="text-3xl font-semibold text-center text-gray-700">
          Thống kê nhân viên
        </h2>
        {/* Biểu đồ phòng ban */}
        <div className="card bg-white shadow-lg rounded-lg border-t-4 border-blue-500">
          <div className="card-body p-4">
            <h3 className="card-title text-xl font-bold text-gray-700">
              Phòng ban
            </h3>
            <div style={{ position: "relative", height: "300px" }}>
              <Bar
                data={departmentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      categoryPercentage: 0.8,
                      barPercentage: 1.0,
                      offset: true,
                      ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45,
                        padding: 10,
                      },
                    },
                    y: {
                      ticks: {
                        stepSize: 1,
                      },
                      max: totalEmployees,
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
            {/*  */}
            <p className="text-sm text-gray-700 mt-4">
              Báo cáo phòng ban: Sự phân bố nhân sự trong các phòng ban cho thấy
              {data.map((item) => {
                return ` ${item.departmentName} có số lượng nhân viên là ${item.totalEmployees}. `;
              })}
            </p>
          </div>
        </div>
        {/* Biểu đồ chức vụ */}
        <div className="card bg-white shadow-lg rounded-lg border-t-4 border-green-500">
          <div className="card-body p-4">
            <h3 className="card-title text-xl font-bold text-gray-700">
              Chức vụ
            </h3>
            <div style={{ position: "relative", height: "300px" }}>
              <Bar
                data={roleData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      categoryPercentage: 0.8,
                      barPercentage: 1.0,
                      offset: true,
                      ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45,
                        padding: 10,
                      },
                    },
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
            {/* Báo cáo chữ giả */}
            <p className="text-sm text-gray-700 mt-4">
              Báo cáo chức vụ: Các chức vụ chủ yếu trong công ty bao gồm:
              {positionData.map((item) => {
                return ` ${item.position} có số lượng ${item.employeeCount} người. `;
              })}
            </p>
          </div>
        </div>
        {/* Biểu đồ giới tính */}
        <div className="card bg-white shadow-lg rounded-lg border-t-4 border-pink-500">
          <div className="card-body p-4">
            <h3 className="card-title text-xl font-bold text-gray-700">
              Giới tính
            </h3>
            <div style={{ position: "relative", height: "300px" }}>
              <Bar
                data={genderData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      categoryPercentage: 0.8,
                      barPercentage: 1.0,
                      offset: true,
                      ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45,
                        padding: 10,
                      },
                    },
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
            {/* Báo cáo chữ giả */}
            <p className="text-sm text-gray-700 mt-4">
              Báo cáo giới tính: Công ty hiện có Nam: {gender.male} người, Nữ{" "}
              {gender.female} người.
            </p>
          </div>
        </div>
        {/* Biểu đồ lương */}
        <h2 className="text-3xl font-semibold text-center text-gray-700 mt-50">
          Thống kê Lương
        </h2>
        <div className="card bg-white shadow-lg rounded-lg border-t-4 border-blue-500">
          <div className="card-body p-4">
            <h3 className="card-title text-xl font-bold text-gray-700">
              Báo cáo tổng lương
            </h3>
            <div className="mb-4 flex items-center gap-2.5">
              <label
                htmlFor="year-select"
                className="block text-sm font-semibold text-gray-700"
              >
                Chọn năm
              </label>
              <select
                id="year-select"
                value={year}
                onChange={handleChangeYear}
                className="mt-2 p-2 border border-gray-300 rounded-md"
              >
                {/* Các năm bạn muốn cho người dùng chọn */}

                <option value={currentYear}>{currentYear} </option>
                <option value={currentYear - 1}>{currentYear - 1}</option>
                <option value={currentYear - 2}>{currentYear - 2}</option>
                <option value={currentYear - 3}>{currentYear - 3}</option>
                <option value={currentYear - 4}>{currentYear - 4}</option>
                <option value={currentYear - 5}>{currentYear - 5}</option>
              </select>
            </div>

            <div style={{ position: "relative", height: "300px" }}>
              {/* Biểu đồ tổng lương theo tháng */}
              <Bar
                data={monthlyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      categoryPercentage: 0.8,
                      barPercentage: 1.0,
                      offset: true,
                      ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45,
                        padding: 10,
                      },
                    },
                    y: {
                      ticks: {
                        stepSize: 1,
                      },
                      max:
                        Math.max(
                          ...monthlyData.map((item) => item.totalSalary)
                        ) + 1000000, // Đảm bảo y có đủ không gian
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>

            <p className="text-sm text-gray-700 mt-4">
              Báo cáo tổng lương theo tháng trong năm {year} cho thấy tổng lương
              của các tháng:
              {monthlyData.map((item) => {
                return `Tháng ${item.month
                  }: ${item.totalSalary.toLocaleString()}. `;
              })}
            </p>

            <div
              style={{
                position: "relative",
                height: "300px",
                marginTop: "2rem",
              }}
            >
              {/* Biểu đồ tổng lương theo quý */}
              <Bar
                data={quarterlyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      categoryPercentage: 0.8,
                      barPercentage: 1.0,
                      offset: true,
                      ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45,
                        padding: 10,
                      },
                    },
                    y: {
                      ticks: {
                        stepSize: 1,
                      },
                      max:
                        Math.max(
                          ...quarterlyData.map((item) => item.totalSalary)
                        ) + 1000000, // Đảm bảo y có đủ không gian
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>

            <p className="text-sm text-gray-700 mt-4">
              Báo cáo tổng lương theo quý trong năm {year}:
              {quarterlyData.map((item) => {
                return `Quý ${item.quarter
                  }: ${item.totalSalary.toLocaleString()}. `;
              })}
            </p>
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

export default EmployeeStatistic;
