import React from "react";
import { Filters, PaginationContainer, ProductsContainer } from "../components";
import { customFetch } from "../utils/customAxios";

const url = "/products";

const allProductsQuery = (params) => {
  const { search, category, company, sort, price, shipping, page } = params;

  return {
    queryKey: [
      "products",
      search ?? "",
      category ?? "all",
      company ?? "all",
      sort ?? "a-z",
      price ?? 100000,
      shipping ?? false,
      page ?? 1,
    ],
    queryFn: () => {
      return customFetch.get(url, {
        params: params,
      });
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    // create a object request from a string
    const requestURL = new URL(request.url);

    //  get all search params convert to array first and finally convert to an object
    const params = Object.fromEntries([...requestURL.searchParams.entries()]);

    // params.shipping = params?.shipping == "on" ? true : false;

    const res = await queryClient.ensureQueryData(allProductsQuery(params));

    const products = res.data.data;
    const meta = res.data.meta;

    return {
      products,
      meta,
      params,
    };
  };

const Products = () => {
  return (
    <div>
      <Filters></Filters>
      <ProductsContainer></ProductsContainer>
      <PaginationContainer></PaginationContainer>
    </div>
  );
};

export default Products;
