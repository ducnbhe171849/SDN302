import React from "react";
import { ComplexPaginationContainer, OrdersList } from "../components";
import { redirect, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import SectionTitle from "../components/SectionTitle";

const ordersQuery = (params, user) => {
  return {
    queryKey: [
      "orders",
      user.username,
      params?.page ? parseInt(params.page) : 1,
    ],
    queryFn: () => {
      return customFetch.get("/orders", {
        params,
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
    },
  };
};

export const loader =
  (store, queryClient) =>
  async ({ request }) => {
    const { userState } = store.getState();

    // user not logged in yet
    if (!userState?.user) {
      toast.warn("Please login first");
      return redirect("/login");
    }

    // get page params
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    try {
      const res = await queryClient.ensureQueryData(
        ordersQuery(params, userState.user)
      );
      const ordersList = res.data.data;
      const meta = res.data.meta;

      return {
        ordersList,
        meta,
      };
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.error?.message ||
        "there was an error placing your order";
      toast.error(errorMessage);
      if (error?.response?.status === 401 || 403) {
        return redirect("/login");
      }
    }

    return null;
  };

const Orders = () => {
  const { meta } = useLoaderData();

  const { total } = meta;

  if (total == 0) {
    return (
      <>
        <SectionTitle text={"Please make an order"}></SectionTitle>
      </>
    );
  }

  return (
    <>
      <SectionTitle text={"Your orders"}></SectionTitle>
      <OrdersList></OrdersList>

      <ComplexPaginationContainer></ComplexPaginationContainer>
    </>
  );
};

export default Orders;
