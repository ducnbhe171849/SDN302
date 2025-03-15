import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const defaultState = {
  cartItems: [],
  numItemsInCart: 0,
  cartTotal: 0,
  shipping: 500,
  tax: 0,
  orderTotal: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: JSON.parse(localStorage.getItem("cart")) || defaultState,
  reducers: {
    // add item to cart
    addItem: (state, action) => {
      const { product } = action.payload;

      const listProduct = state.cartItems;

      const newProduct = listProduct.find((item) => {
        return item.cartID == product.cartID;
      });

      if (newProduct) {
        newProduct.amount += product.amount;
      } else {
        state.cartItems.push(product);
      }

      state.numItemsInCart += product.amount;
      state.cartTotal += product.amount * parseInt(product.price);
      state.tax = 0.1 * state.cartTotal;
      cartSlice.caseReducers.calculateTotal(state);

      toast.success("success");
    },

    // clear cart
    clearCart: (state) => {
      localStorage.setItem("cart", JSON.stringify(defaultState));
      return defaultState;
    },

    // remove item
    removeItem: (state, action) => {
      const cartID = action.payload.cartID;

      const product = state.cartItems.find((item) => {
        return item.cartID == cartID;
      });

      state.cartItems = state.cartItems.filter((item) => {
        return item.cartID != cartID;
      });

      state.numItemsInCart -= product.amount;
      state.cartTotal -= product.amount * parseInt(product.price);
      state.tax = 0.1 * state.cartTotal;
      cartSlice.caseReducers.calculateTotal(state);
      toast.success("Remove item success");
    },

    // edit item
    editItem: (state, action) => {
      const { cartID, amount } = action.payload;

      const newItem = state.cartItems.find((item) => {
        return (item.cartID = cartID);
      });

      state.numItemsInCart += amount - newItem.amount;
      state.cartTotal += (amount - newItem.amount) * parseInt(newItem.price);
      newItem.amount = amount;
      state.tax = 0.1 * state.cartTotal;
      cartSlice.caseReducers.calculateTotal(state);
      toast.success("Cart updated");
    },

    // calculate total
    calculateTotal: (state) => {
      state.orderTotal = state.cartTotal + state.tax + state.shipping;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addItem, clearCart, editItem, removeItem } = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
