import React from "react";
import { CheckoutComp } from "../components";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

export const loader = (store) => () => {
  const user = store.getState()?.userState?.user;

  if (!user) {
    toast.warn("Please login first");
    return redirect("/login");
  }

  return null;
};

const Checkout = () => {
  return (
    <div>
      <CheckoutComp></CheckoutComp>
    </div>
  );
};

export default Checkout;
