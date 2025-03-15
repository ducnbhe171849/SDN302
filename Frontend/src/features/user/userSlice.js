import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const themes = {
  luxury: "luxury",
  valentine: "valentine",
};

const getThemeFromLocalStorage = () => {
  const theme = localStorage.getItem("theme") || themes.luxury;
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
};

const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("user")) || null;
};

const initialState = {
  user: getUserFromLocalStorage(),
  theme: getThemeFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    // login
    loginUser: (state, action) => {
      const { data } = action.payload;

      const user = {
        ...data.user,
      };

      state.user = user;

      localStorage.setItem("user", JSON.stringify(user));
    },

    // logout
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.success("logged out successfully");
    },

    // toggle theme
    toggleTheme: (state) => {
      const { luxury, valentine } = themes;

      const newTheme = state.theme === luxury ? valentine : luxury;

      document.documentElement.setAttribute("data-theme", newTheme);

      state.theme = newTheme;

      localStorage.setItem("theme", newTheme);
    },
  },
});

export const { loginUser, logoutUser, toggleTheme } = userSlice.actions;

export const userReducer = userSlice.reducer;
