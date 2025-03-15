import React from "react";
import { Form, Link, redirect } from "react-router-dom";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { customFetch } from "../utils/customAxios";
import { toast } from "react-toastify";
import { registerSchema } from "../dto/authentication/register.dto";
import { changePasswordSchema } from "../dto/authentication/changePassword";
import axios from "axios";

// register action
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  let validData = {};
  try {
    validData = changePasswordSchema.parse(data); // Validate dữ liệu
  } catch (error) {
    // Lặp qua từng lỗi trong mảng `issues` và hiển thị toast

    error.issues.forEach((issue) => {
      toast.error(`${issue.path.join(".")}: ${issue.message}`); // Hiển thị từng lỗi
    });
    return redirect("/register");
  }

  try {
    console.log(validData);

    const res = await customFetch.post("/user/password/reset", {
      password: validData.newPassword,
    });

    toast.success("Đổi mật khẩu thành công");

    const status = JSON.parse(localStorage.getItem("user"))?.status;

    if (!status || status == "Waiting") {
      toast.success("Vui lòng đăng nhập lại");
      return redirect("/login");
    }

    return redirect("/myProfile");
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.error?.message ||
      "please double check your credentials";
    toast.error(errorMessage);
  }

  return null;
};

const Register = () => {
  return (
    <>
      <section className="h-screen grid place-items-center">
        <Form
          method="POST"
          className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
        >
          <h4 className="text-center text-3xl font-bold">Đổi mật khẩu</h4>

          {/* confirm password */}
          <FormInput
            type={"password"}
            label={"New password"}
            name={"newPassword"}
          ></FormInput>

          {/* confirm password */}
          <FormInput
            type={"password"}
            label={"Confirm password"}
            name={"confirmPassword"}
          ></FormInput>

          {/* submit btn */}
          <div className="mt-4">
            <Button text={"Change"}></Button>
          </div>
        </Form>
      </section>
    </>
  );
};

export default Register;

// - First, for a text input with type `'text'`, label `'username'`, and name `'username'`.
// - Second, for an email input with type `'email'`, label `'email'`, and name `'email'`.
// - Third, for a password input with type `'password'`, label `'password'`, and name `'password'`.
