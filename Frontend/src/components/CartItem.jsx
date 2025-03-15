import React from "react";
import { generateSelectOptions } from "../utils/generateSelectOptions";
import { formatPrice } from "../utils/formatPrice";
import { useDispatch } from "react-redux";
import { editItem, removeItem } from "../features/cart/cartSlice";

const CartItem = ({
  cartID,
  amount,
  color,
  company,
  image,
  price,
  productID,
  title,
}) => {
  const dispatch = useDispatch();

  return (
    <article
      key={cartID}
      className="mb-12 flex flex-col gap-y-4 sm:flex-row flex-wrap border-b border-base-300 pb-6 last:border-b-0"
    >
      {/* img */}
      <img
        src={image}
        alt={title}
        className="h-24 w-24 object-cover rounded-lg sm:h-32 sm:w-32"
      />

      {/* details */}
      <div className="sm:ml-16 sm:w-48">
        {/* title */}
        <h3 className="capitalize font-medium">{title}</h3>

        {/* company */}
        <h4 className="mt-2 text-sm text-neutral-content">{company} </h4>

        {/* color */}
        <p className="mt-4 text-sm capitalize flex items-center gap-x-2">
          color:
          <span
            style={{
              backgroundColor: color,
            }}
            className="badge badge-sm"
          ></span>
        </p>
      </div>

      <div className="sm:ml-12">
        {/* amount */}
        <div className="form-control max-w-xs">
          <label htmlFor="amount" className="label p-0">
            <span className="label-text">amount</span>
          </label>

          <select
            className="mt-2 select select-base select-bordered select-xs"
            name="amount"
            id="amount"
            value={amount}
            onChange={(e) => {
              dispatch(
                editItem({
                  cartID,
                  amount: parseInt(e.target.value),
                })
              );
            }}
          >
            {generateSelectOptions(amount + 5)}
          </select>
        </div>

        <button
          className="mt-2 link link-primary link-hover text-sm"
          onClick={() => {
            dispatch(removeItem({ cartID }));
          }}
        >
          remove
        </button>
      </div>

      {/* price */}
      <p className="font-medium sm:ml-auto">{formatPrice(price)}</p>
    </article>
  );
};

export default CartItem;
