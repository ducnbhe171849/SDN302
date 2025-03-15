import React from "react";

const FormInput = ({ label, type, name, defaultValue, size, set }) => {
  return (
    <>
      <div className="form-control">
        <label htmlFor={name} className="label ">
          <span className="label-text capitalize"> {label}</span>
        </label>
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          onChange={(e) => {
            if (set) {
              set(e.target.value);
            }
          }}
          className={`input input-bordered w-full ${size} validator`}
        />
      </div>
    </>
  );
};

export default FormInput;
