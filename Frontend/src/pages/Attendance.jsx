import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";

import { redirect } from "react-router-dom";
/**
 * ====================================
 * loader
 * ====================================
 */

export const loader =
  (store) =>
  async ({ params }) => {
    const { userState } = store.getState();

    if (!userState?.user) {
      toast.warn("Please login first");
      return redirect("/login");
    }

    const { role } = JSON.parse(localStorage.getItem("user"));

    if (role == "Admin") {
      toast.error("Admin không thể điểm danh");
      return redirect("/");
    }
    try {
      // check already attendance today
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

/**
 * ====================================
 * action
 * ====================================
 */

const Attendance = () => {
  const [checkInTime, setCheckInTime] = useState("08:00");
  const [checkOutTime, setCheckOutTime] = useState("17:00");
  const [overtime, setOvertime] = useState(0);
  const [leave, setLeave] = useState(false);

  useEffect(() => {
    calculateOvertime();
  }, [checkInTime, checkOutTime, leave]);

  const calculateOvertime = () => {
    if (leave) {
      setOvertime(0);
      return;
    }

    const [inHours, inMinutes] = checkInTime.split(":").map(Number);
    const [outHours, outMinutes] = checkOutTime.split(":").map(Number);

    let totalMinutesWorked =
      outHours * 60 + outMinutes - (inHours * 60 + inMinutes);
    if (totalMinutesWorked < 0) {
      totalMinutesWorked += 24 * 60; // Điều chỉnh nếu qua nửa đêm
    }

    const overtimeMinutes = Math.max(totalMinutesWorked - 8 * 60, 0);
    setOvertime(overtimeMinutes / 60);
  };

  const handleSubmit = async () => {
    if (!leave && (!checkInTime || !checkOutTime)) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const attendanceData = {
      checkInTime: leave ? "N/A" : checkInTime,
      checkOutTime: leave ? "N/A" : checkOutTime,
      overtime: leave ? 0 : overtime,
      leave,
      date: "2025-03-03",
    };

    const [inHours, inMinutes] = checkInTime.split(":").map(Number);
    const [outHours, outMinutes] = checkOutTime.split(":").map(Number);

    let totalMinutesWorked =
      outHours * 60 + outMinutes - (inHours * 60 + inMinutes);
    console.log(totalMinutesWorked);
    if (totalMinutesWorked <= 0) {
      toast.error(
        "Thời gian ra không thể nhỏ hơn thời gian vào vui lòng kiểm tra lại"
      );
    } else {
      try {
        const res = await customFetch.post("/attendance", {
          ...attendanceData,
        });
        console.log(res);
        if (res.response?.status == 400) {
          toast.error(res.response.data.message);
        } else if (res.data?.error) {
          toast.error(res.response.data.message);
        } else {
          toast.success("Điểm danh thành công");
        }
      } catch (error) {
        toast.error(error.response.data?.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
      <div className="card w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <div className="card-body">
          <h2 className="text-xl font-semibold text-center mb-4">
            Chấm công hàng ngày
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Giờ vào</label>
              <input
                type="time"
                className="input input-bordered w-full"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                disabled={leave}
                step="60"
              />
            </div>
            <div>
              <label className="label">Giờ ra</label>
              <input
                type="time"
                className="input input-bordered w-full"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                disabled={leave}
                step="60"
              />
            </div>
            <div>
              <label className="label">Làm thêm giờ</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={overtime}
                readOnly
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={leave}
                onChange={() => setLeave(!leave)}
              />
              <label className="label">Nghỉ làm hôm nay</label>
            </div>
            <button className="btn btn-primary w-full" onClick={handleSubmit}>
              Gửi chấm công
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
