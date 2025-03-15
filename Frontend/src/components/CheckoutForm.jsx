import React from "react";
import { Form, redirect } from "react-router-dom";
import FormInput from "./FormInput";
import Button from "./Button";
import { toast } from "react-toastify";
import { customFetch } from "../utils/customAxios";
import { clearCart } from "../features/cart/cartSlice";

export const action = (store, queryClient) => {
  return async ({ request }) => {
    // get name and address from form
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const { name, address } = data;

    const { cartItems, numItemsInCart, orderTotal } =
      store.getState().cartState;

    const { user } = store.getState().userState;

    // empty name or address
    if (!name || !address) {
      toast.warn("Name and address can not be empty!");
      return null;
    }

    // order data
    const ordersData = {
      address: address,
      cartItems: cartItems,
      chargeTotal: orderTotal,
      name: name,
      numItemsInCart: numItemsInCart,
      orderTotal: `${orderTotal}`,
    };

    try {
      const res = await customFetch.post(
        "/orders",
        {
          data: ordersData,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      store.dispatch(clearCart());
      toast.success("order placed successfully");
      queryClient.removeQueries(["orders"]);
      return redirect("/orders");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error?.message ||
        "there was an error placing your order";
      toast.error(errorMessage);
      if (error.response.status === 401 || 403) {
        return redirect("/login");
      }
    }

    return null;
  };
};

const CheckoutForm = () => {
  return (
    <>
      <Form method="post" className="flex flex-col gap-y-4">
        <h4 className="font-medium text-xl">Shipping information</h4>

        <FormInput
          label={"name"}
          name={"name"}
          type={"text"}
          size={"input-sm"}
        ></FormInput>

        <FormInput
          label={"address"}
          name={"address"}
          type={"text"}
          size={"input-sm"}
        ></FormInput>

        <div className="mt-4">
          <Button text={"Place your order"}></Button>
        </div>
      </Form>
    </>
  );
};

export default CheckoutForm;
