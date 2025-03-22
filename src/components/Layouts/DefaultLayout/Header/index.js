import { NavLink } from "react-router-dom";
import style from "./Header.module.css";
import Auth from "../../../Auth";
import Search from "../../Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";

function Header() {

  return (
    <div className={`${style.container}`}>
      <div className={`container ${style.header}`}>
        <div className={style.logo}>
          <NavLink to="/">
            <img
              width="70%"
              height="100%"
              src="http://dtgroup.lovestoblog.com/anh/logodt.png"
            ></img>
          </NavLink>
        </div>
        <Search></Search>
        <nav>
          <ul className={style.nav}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tin-tuc"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Tin tức
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/thu-vien"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Thư Viện
              </NavLink>
            </li>
            <li>
              <Auth></Auth>
            </li>
            <li>
              <NavLink
                to="/quan-tri"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Quản trị
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gio-hang"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                <FontAwesomeIcon
                  icon={faCartShopping}
                  style={{ color: "rgb(19 17 51)" }}
                />
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
     
    </div>
  );
}

export default Header;
