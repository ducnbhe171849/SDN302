import { FeaturedProducts, Hero } from "../components";
import { customFetch } from "../utils/customAxios";
import { Link } from "react-router-dom";
import React, { useState } from "react";
const url = "/products?featured=true";

const featuredProductQuery = {
  queryKey: ["featuredProducts"],
  queryFn: () => {
    return customFetch.get(url);
  },
};

export const loader = (queryClient) => async () => {
  const res = await queryClient.ensureQueryData(featuredProductQuery);
  const products = res.data.data;
  return { products };
};

const Landing = () => {
  // Dữ liệu các phòng ban (department)
  const departments = [
    "Marketing",
    "Kỹ thuật",
    "Tài chính",
    "Nhân sự",
    "Hành chính",
    "Phát triển sản phẩm",
    "Bán hàng",
    "Bán hàng",
    "Bán hàng",
    "Bán hàng",
    "Bán hàng",
    "Bán hàng",
    "Bán hàng",
    "Bán hàng",
    "Bán hàng",
    "Bán hàng",
    "Bán hàng",
    "Bán hàng",
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Danh sách các phòng ban
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {departments.map((department, index) => (
          <div key={index} className="flex items-center">
            <Link
              to={`/department/${department.toLowerCase()}`} // Link sẽ trỏ tới một route tùy chỉnh cho mỗi phòng ban
              className="text-xl text-blue-500 hover:text-blue-700 transition duration-200"
            >
              {department}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
