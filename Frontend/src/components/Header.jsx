import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/user/userSlice";
import { clearCart } from "../features/cart/cartSlice";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";

const Header = () => {
  // get user data
  const { user } = useSelector((state) => {
    return state.userState;
  });

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    queryClient.removeQueries();
    navigate("/login");
  };

  const dispatch = useDispatch();

  const { note } = useLoaderData();
  return (
    <header className="bg-neutral py-2 text-neutral-content">
      {/* User Section */}
      <div className="align-element flex justify-between items-center w-full">
        {/* Marquee Section */}
        <div className="overflow-hidden py-2 bg-neutral ml-0">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-sm font-semibold mx-4">
              <Link>🎉Thông báo: {note}🎉</Link>
            </span>
            <span className="text-sm font-semibold mx-4">
              🚀 Chúc bạn 1 ngày làm việc hiệu quả 🚀
            </span>
            <span className="text-sm font-semibold mx-4">
              📅 Hôm nay ngày {moment().format(` DD  MM  YYYY`)} 📅
            </span>
          </div>
        </div>

        {/* User Section */}
        {user != null ? (
          <div className="flex gap-x-2 sm:gap-x-8 items-center">
            <Link to={"/myProfile"} className="text-xs sm:text-sm">
              Hello, {user.username}{" "}
            </Link>
            <button
              className="btn btn-xs btn-outline btn-primary"
              onClick={handleLogout}
            >
              logout
            </button>
          </div>
        ) : (
          <div className="flex gap-x-6 justify-center items-center">
            <Link to={"/login"} className="link link-hover text-xs sm:text-sm">
              Sign in / Guest
            </Link>

            <Link
              to={"/register"}
              className="link link-hover text-xs sm:text-sm"
            >
              Create an account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
