import React, { useState } from "react";
import { customFetch } from "../utils/customAxios";
import { Link, useLoaderData } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";
import { generateSelectOptions } from "../utils/generateSelectOptions";
import { useDispatch } from "react-redux";
import { addItem } from "../features/cart/cartSlice";

const url = "/products";

const singleProductQuery = (id) => {
  return {
    queryKey: ["singleProduct", id],
    queryFn: () => customFetch.get(`${url}/${id}`),
  };
};

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const { id } = params;

    const res = await queryClient.ensureQueryData(singleProductQuery(id));

    const product = res.data.data;

    return { product };
  };

const SingleProduct = () => {
  const dispatch = useDispatch();

  const { product } = useLoaderData();

  const {
    attributes: { image, title, price, description, colors, company },
  } = product;

  const vndAmount = formatPrice(price);

  // color state
  const [color, setColor] = useState(colors[0]);

  // amount state
  const [amount, setAmount] = useState(1);

  //  product information
  const cartProduct = {
    cartID: product.id + color,
    productID: product.id,
    image,
    title,
    price,
    amount,
    color,
    company,
  };

  const handleAmount = (e) => {
    const newAmount = e.target.value;

    setAmount(parseInt(newAmount));
  };

  const handleColor = (newColor) => {
    setColor(newColor);
  };

  return (
    <>
      <section>
        <div className="text-md breadcrumbs">
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/products"}>Products </Link>
            </li>
          </ul>
        </div>

        {/* product */}
        <div className="mt-6 grid gap-y-8 lg:grid-cols-2  lg:gap-x-16 ">
          {/* img */}
          <img
            src={image}
            alt=""
            className="w-96 h-96 object-cover rounded-lg lg:w-full"
          />

          {/* product */}
          <div>
            <h1 className="capitalize text-3xl font-bold"> {title} </h1>
            <h4 className="text-xl text-neutral-content font-bold mt-2">
              {company}
            </h4>

            <p className="text-xl mt-3"> {vndAmount} </p>
            <p className="mt-6 leading-8">{description}</p>

            {/* colors */}
            <div className="mt-6">
              <h4 className="text-md font-medium tracking-wider capitalize">
                Colors
              </h4>

              <div className="mt-2">
                {colors.map((item) => {
                  return (
                    <>
                      <button
                        key={item}
                        type="button"
                        className={`badge w-6 h-6 mr-2 ${
                          item === color && "border-2 border-secondary"
                        }`}
                        style={{
                          backgroundColor: item,
                        }}
                        onClick={() => {
                          handleColor(item);
                        }}
                      ></button>
                    </>
                  );
                })}
              </div>
            </div>

            {/* amount */}
            <div className="form-control w-full max-w-xs">
              <label className="label" htmlFor="amount">
                <h4 className="text-md font-medium tracking-wider capitalize">
                  amount
                </h4>
              </label>

              <select
                className="select select-secondary select-bordered select-md"
                name=""
                id="amount"
                value={amount}
                onChange={handleAmount}
              >
                {generateSelectOptions(10)}
              </select>
            </div>

            {/* cart btn */}
            <div className="mt-10">
              <button
                className="btn btn-secondary btn-md"
                onClick={() => {
                  dispatch(
                    addItem({
                      product: cartProduct,
                    })
                  );
                }}
              >
                Add to bag
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
