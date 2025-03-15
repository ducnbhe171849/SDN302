import React from "react";
import { Outlet, redirect, useNavigation } from "react-router-dom";
import { Header, Loading, Navbar } from "../components";
import { customFetch } from "../utils/customAxios";
import { toast } from "react-toastify";

export const loader = (store) => async () => {
  const { userState } = store.getState();

  if (!userState?.user) {
    toast.warn("Please login first");
    return redirect("/login");
  }

  const status = JSON.parse(localStorage.getItem("user")).status;

  if (status == "Waiting") {
    toast.warning("Vui lòng đổi mật khẩu");
    return redirect("/reset/password");
  }

  try {
    const res = await customFetch.get("/notification");

    const notifications = res.data.data;
    let note = notifications[0]?.title ?? "Chúc bạn 1 ngày làm việc hiệu quả";
    note = note;
    return {
      note,
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

const HomeLayout = () => {
  const { state } = useNavigation();

  return (
    <>
      <Header></Header>
      <Navbar></Navbar>

      <section className="align-items py-20 px-0">
        {state === "loading" ? <Loading></Loading> : <Outlet></Outlet>}
      </section>
    </>
  );
};

export default HomeLayout;
