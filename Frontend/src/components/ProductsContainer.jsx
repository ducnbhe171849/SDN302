import React, { useState } from "react";
import ProductsList from "./ProductsList";
import { useLoaderData } from "react-router-dom";
import ProductsGrid from "./ProductsGrid";

import { BsFillGridFill, BsGrid, BsList } from "react-icons/bs";

const ProductsContainer = () => {
  const {
    meta: { pagination },
  } = useLoaderData();

  const totalProducts = pagination.total;

  const [layout, setLayout] = useState("grid");

  const handleLayout = () => {
    setLayout(layout == "grid" ? "list" : "grid");
  };

  const setActiveStyles = (pattern) => {
    return `text-xl btn btn-circle btn-sm ${
      pattern === layout
        ? "btn-primary text-primary-content"
        : "btn-ghost text-base-content"
    }`;
  };

  return (
    <>
      <div
        className="flex justify-between items-center mt-8 border-b
        border-base-300 pb-5"
      >
        <h4>
          {totalProducts} product{totalProducts > 1 && "s"}
        </h4>

        <div className="flex gap-x-2">
          <button
            type="button"
            onClick={handleLayout}
            className={setActiveStyles("grid")}
          >
            <BsFillGridFill></BsFillGridFill>
          </button>

          <button
            type="button"
            onClick={handleLayout}
            className={setActiveStyles("list")}
          >
            <BsList></BsList>
          </button>
        </div>
      </div>

      <div>
        {totalProducts == 0 && (
          <h5 className="text-2xl mt-16">
            Sorry, no products matched your search...
          </h5>
        )}
        {layout === "grid" ? (
          <ProductsGrid></ProductsGrid>
        ) : (
          <ProductsList></ProductsList>
        )}
      </div>
    </>
  );
};

export default ProductsContainer;
