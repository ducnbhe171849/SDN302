import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const links = [
  { id: 1, url: "/", text: "Phòng ban" },
  { id: 2, url: "/employee", text: "Nhân viên" },
  { id: 3, url: "/attendance/statistics", text: "Điểm danh" },
  { id: 4, url: "/department/statistic/all", text: "Thống kê" },
  { id: 5, url: "/notification", text: "Thông báo" },
  { id: 6, url: "/logs", text: "Lịch sử hoạt động" },
];

const NavLinks = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const role = userData.role;
  // get user data
  const { user } = useSelector((state) => {
    return state.userState;
  });

  return (
    <>
      {role == "Admin" ? (
        links.map((item) => {
          const { id, url, text } = item;

          return (
            <li key={id}>
              <NavLink className={"capitalize"} to={url}>
                {text}
              </NavLink>
            </li>
          );
        })
      ) : (
        <NavLink className={"capitalize"} to={"/notification"}>
          Thông báo
        </NavLink>
      )}
    </>
  );
};

export default NavLinks;
