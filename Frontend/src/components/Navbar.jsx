import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BsMoonFill, BsSunFill, BsFillPersonFill } from "react-icons/bs";
import { FaBarsStaggered } from "react-icons/fa6";
import NavLinks from "./NavLinks";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/user/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const numItemInCart = useSelector((state) => {
    return state.cartState.numItemsInCart;
  });

  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className="bg-base-200">
      <div className="navbar align-element">
        {/* first div */}
        <div className="navbar-start">
          {/* Title */}
          <NavLink
            className={"hidden lg:flex btn btn-primary text-3xl"}
            to={"/"}
          >
            EMS
          </NavLink>

          {/* dropdown */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <FaBarsStaggered className="h-6 w-6"></FaBarsStaggered>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52 "
            >
              <NavLinks></NavLinks>
            </ul>
          </div>
        </div>

        {/* second div */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal">
            {" "}
            <NavLinks></NavLinks>
          </ul>
        </div>

        {/* third div */}
        <div className="navbar-end">
          {/* theme */}
          <label className="swap swap-rotate">
            <input type="checkbox" onClick={handleTheme} />

            {/* sun */}
            <BsSunFill className="swap-on h-4 w-4 fill-current"></BsSunFill>

            {/* moon */}

            <BsMoonFill className="swap-off h-4 w-4 fill-current"></BsMoonFill>
          </label>

          <NavLink to={"/myProfile"}>
            <div className="ml-4">
              <BsFillPersonFill className="swap-off h-6 w-6 fill-current cursor-pointer" />
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
