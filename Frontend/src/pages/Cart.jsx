import React from "react";
import SectionTitle from "../components/SectionTitle";
import { CartItemsList, CartTotals } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Cart = () => {
  // get cart data
  const { numItemsInCart } = useSelector((state) => {
    return state.cartState;
  });

  // get user data
  const { user } = useSelector((state) => {
    return state.userState;
  });

  return (
    <>
      <SectionTitle
        text={numItemsInCart != 0 ? "cart detail" : "Your cart is empty"}
      ></SectionTitle>
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CartItemsList></CartItemsList>
        </div>

        <div className="col-span-4 lg:pl-4">
          <CartTotals></CartTotals>
          {user ? (
            <Link to={"/checkout"} className="btn btn-primary btn-block mt-8">
              Proceed to checkout
            </Link>
          ) : (
            <Link to={"/login"} className="btn btn-primary btn-block mt-8">
              Please login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
