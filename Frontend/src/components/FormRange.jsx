import React, { useState } from "react";
import { formatPrice } from "../utils/formatPrice";

const FormRange = ({ label, name, size, selectPrice }) => {
  const step = 1000000;
  const maxPrice = 500000000;

  const [selectedPrice, setSelectedPrice] = useState(selectPrice);

  return (
    <div className="form-control">
      <label htmlFor={name} className="label cursor-pointer">
        <span className="label-text capitalize">{label}</span>
        <span className="">{formatPrice(selectedPrice)}</span>
      </label>
      <input
        type="range"
        min={0}
        name={name}
        max={maxPrice}
        value={selectedPrice}
        onChange={(e) => {
          setSelectedPrice(e.target.value);
        }}
        step={step}
        className={`range range-primary ${size}`}
      />

      <div className="w-full flex justify-between text-xs px-2 mt-2">
        <span className="font-bold text-md">{formatPrice(0)} </span>
        <span className="font-bold text-md">max: {formatPrice(maxPrice)} </span>
      </div>
    </div>
  );
};

export default FormRange;
