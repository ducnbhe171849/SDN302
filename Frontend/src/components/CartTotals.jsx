import React from "react";
import { useSelector } from "react-redux";
import { formatPrice } from "../utils/formatPrice";

const CartTotals = () => {
  const { orderTotal, cartTotal, shipping, tax } = useSelector((state) => {
    return state.cartState;
  });

  return (
    <div className="card bg-base-200">
      <div className="cart-body">
        {/* subtotal */}
        <p className="flex justify-between text-xs border-b border-base-300 pb-2">
          <span>Subtotal</span>
          <span className="font-medium"> {formatPrice(cartTotal)} </span>
        </p>

        {/* shipping */}
        <p className="flex justify-between text-xs border-b border-base-300 pb-2">
          <span>Shipping</span>
          <span className="font-medium"> {formatPrice(shipping)} </span>
        </p>

        {/* tax */}
        <p className="flex justify-between text-xs border-b border-base-300 pb-2">
          <span>Tax</span>
          <span className="font-medium"> {formatPrice(tax)} </span>
        </p>

        {/* total */}
        <p className="mt-4 flex justify-between text-sm pb-2">
          <span className="font-bold">Total</span>
          <span className="font-bold"> {formatPrice(orderTotal)} </span>
        </p>
      </div>
    </div>
  );
};

export default CartTotals;
