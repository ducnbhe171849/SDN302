import React from "react";

const FormCheckbox = ({ label, name, defaultValue, size }) => {
  return (
    <div className="form-control items-center">
      <input
        type="checkbox"
        name={name}
        id={name}
        defaultChecked={defaultValue}
        className={`checkbox checkbox-primary mr-1.5 ${size}`}
      />

      <label htmlFor={name} className="label cursor-pointer">
        <span className="label-text capitalize">{label}</span>
      </label>
    </div>
  );
};

export default FormCheckbox;
