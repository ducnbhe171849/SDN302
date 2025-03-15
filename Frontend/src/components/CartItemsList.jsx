import React from "react";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";

const CartItemsList = () => {
  const { cartItems } = useSelector((state) => {
    return state.cartState;
  });

  return (
    <div>
      {cartItems.map((item) => {
        return (
          <>
            <CartItem key={item.cartID} {...item}></CartItem>
          </>
        );
      })}
    </div>
  );
};

export default CartItemsList;
