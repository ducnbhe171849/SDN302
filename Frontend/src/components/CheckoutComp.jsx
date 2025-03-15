import React from "react";
import { useSelector } from "react-redux";
import SectionTitle from "./SectionTitle";
import CheckoutForm from "./CheckoutForm";
import CartTotals from "./CartTotals";

const CheckoutComp = () => {
  const cartTotal = useSelector((state) => {
    return state.cartState?.cartTotal;
  });

  if (cartTotal === 0) {
    return (
      <>
        <SectionTitle text={"Your cart is empty"}></SectionTitle>
      </>
    );
  }

  return (
    <>
      <SectionTitle text={"place your order"}></SectionTitle>
      <div className="mt-8 grid gap-8 md:grid-cols-2 items-start">
        <CheckoutForm></CheckoutForm>
        <CartTotals></CartTotals>
      </div>
    </>
  );
};

export default CheckoutComp;
