import React, { useEffect, useState } from "react";
import { Button, FormInput } from "../components";
import { Form, Link, redirect, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import { useDispatch } from "react-redux";

const ForgotPassword = () => {
  const [layout, setLayout] = useState(true);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Forgot password</h4>
        {/* email */}
        {layout ? (
          <div className="form-control">
            <label htmlFor={"email"} className="label ">
              <span className="label-text capitalize"> {"Enter email"}</span>
            </label>
            <input
              type={"email"}
              name={"email"}
              onChange={(e) => {
                setEmail(e.target.value.trim());
              }}
              value={email}
              className={`input input-bordered w-full input-md validator`}
            />
          </div>
        ) : (
          <div className="form-control">
            <label htmlFor={"OTP"} className="label ">
              <span className="label-text capitalize">
                {"Enter OTP(hết hạn sau 3 phút)"}
              </span>
            </label>

            <input
              type={"OTP"}
              name={"OTP"}
              value={otp}
              onChange={(e) => {
                const data = e.target.value.trim();
                setOtp(data);
              }}
              className={`input input-bordered w-full input-md validator`}
            />
          </div>
        )}
        {/* password */}
        <div
          onClick={async (e) => {
            e.preventDefault();
            if (layout) {
              // empty email
              if (email) {
                const res = await customFetch.post("/user/password/forgot", {
                  email,
                });
                if (res.data.code == 400) {
                  toast.error("email không tồn tại");
                } else {
                  setLayout(false);
                  toast.success("Kiểm tra email của bạn");
                }
              } else {
                toast.error("Email không được để trống");
              }
            } else {
              if (otp) {
                const res = await customFetch.post("/user/password/otp", {
                  email,
                  otp,
                });

                if (res.data.code == 400) {
                  toast.error("OTP không chính xác");
                } else {
                  toast.success("Đổi mật khẩu mới của bạn");
                  navigate("/reset/password");
                }
              } else {
                toast.error("Vui lòng nhập OTP");
              }
            }
          }}
          className="mt-4"
        >
          <Button text={"Send"}></Button>
        </div>
        <Link to={"/login"}>Login</Link>
      </Form>
    </section>
  );
};

export default ForgotPassword;
