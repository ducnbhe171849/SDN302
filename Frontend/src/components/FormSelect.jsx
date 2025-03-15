import React from "react";

const FormSelect = ({ label, name, list, defaultValue, size }) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label ">
        <span className="label-text capitalize"> {label}</span>
      </label>

      <select
        className={`select select-bordered ${size}`}
        name={name}
        id={name}
        defaultValue={defaultValue}
      >
        <option value={"all"}>all</option>
        {list.map((item) => {
          return (
            <option id={item._id} key={item._id} value={item._id}>
              {item.departmentName}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FormSelect;
