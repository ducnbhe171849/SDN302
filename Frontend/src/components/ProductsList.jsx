import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

const ProductsList = () => {
  const { products } = useLoaderData();

  return (
    <div className="grid mt-12 gap-y-8">
      {products.map((item) => {
        const { id, attributes } = item;

        const { title, price, image, company } = attributes;

        return (
          <>
            <Link
              key={id}
              to={`/products/${item.id}`}
              className="p-8 rounded-lg flex flex-col sm:flex-row gap-y-4 flex-wrap bg-base-100 shadow-xl hover:shadow-2xl duration-300 group"
            >
              <img
                src={image}
                alt=""
                className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover group-hover:scale-105
                 transition duration-300"
              />

              <div className="ml-0 sm:ml-16">
                <h3 className="capitalize font-medium text-lg">{title}</h3>
                <h4 className="capitalize text-neutral-content">{company}</h4>
              </div>

              <p className="font-medium ml-0 sm:ml-auto text-lg">
                {formatPrice(price)}
              </p>
            </Link>
          </>
        );
      })}
    </div>
  );
};

export default ProductsList;
