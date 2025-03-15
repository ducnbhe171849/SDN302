import React from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import moment from "moment";
export const loader = (store) => async () => {
  const { userState } = store.getState();

  if (!userState?.user) {
    toast.warn("Please login first");
    return redirect("/login");
  }

  try {
    const res = await customFetch.get("/notification");

    return {
      notifications: res.data.data,
    };
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.message);
    if (error?.response?.message === 401 || 403) {
      return redirect("/login");
    }
  }
  return null;
};

const NotificationList = () => {
  const { notifications } = useLoaderData();

  const { role } = JSON.parse(localStorage.getItem("user"));
  console.log(role);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4">Danh sách thông báo</h2>
        {role == "Admin" ? (
          <Link to={"/notification/create"} className="btn btn-success">
            Tạo thông báo
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            className="p-4 bg-white shadow-md rounded-lg"
            key={notification._id}
          >
            <div className="collapse bg-base-100 border-base-300 border">
              <input type="checkbox" />
              <div className="collapse-title font-semibold">
                {notification.title}
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: notification.message }}
                className="collapse-content text-sm"
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <span>Người gửi: {notification.sentBy?.username}</span>
              <span className="mx-2">|</span>
              <span>
                Phòng ban:{" "}
                {!notification.targetDepartment
                  ? "Mọi người"
                  : notification.targetDepartment?.departmentName}
              </span>
              <span className="mx-2">|</span>
              <span>
                Ngày gửi:{" "}
                {moment(notification.sentAt).format("HH:mm YYYY-MM-DD")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
