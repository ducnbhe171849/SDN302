import React from "react";
import { Button, FormInput } from "../components";
import { Form, Link, redirect, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import { loginUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { loginSchema } from "../dto/authentication/login.dto";

export const action = (store) => {
  return async ({ request }) => {
    // get username and password
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      const validData = loginSchema.safeParse(data);

      if (!validData.success) {
        const newErrors = validData?.error?.formErrors?.fieldErrors;
        let errorMessages = [
          newErrors?.email ? newErrors.email[0] + ", " : "",
          newErrors?.password ? newErrors.password[0] : "",
        ].join(" ");
        toast.error(errorMessages);

        return redirect("/login");
      }

      const res = await customFetch.post("/user/login", validData.data);

      // save user data to local

      if (res.data.code == "400") {
        toast.error(res.data.message);
        return redirect("/login");
      }

      const userData = res.data;

      store.dispatch(
        loginUser({
          data: userData,
        })
      );
      toast.success("logged in successfully");

      if (userData.user.role == "Employee") {
        return redirect("/attendance");
      } else {
        return redirect("/");
      }
    } catch (error) {
      console.log(error);

      const errorMessage =
        error?.response?.message || "please double check your credentials";
      toast.error(errorMessage);
    }

    return null;
  };
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // label, type, name, defaultValue
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
        {/* email */}
        <FormInput type={"email"} label={"email"} name={"email"}></FormInput>
        {/* password */}
        <FormInput
          type={"password"}
          label={"password"}
          name={"password"}
        ></FormInput>
        {/* button */}
        <div className="mt-4">
          <Button text={"login"}></Button>
        </div>{" "}
        <Link to={"/forgot/password"}>Forgot password</Link>
      </Form>
    </section>
  );
};

export default Login;
