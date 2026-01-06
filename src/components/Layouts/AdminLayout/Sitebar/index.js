import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Style from "./Sitebar.module.css";
import { AiFillSignal } from "react-icons/ai";
import { FaShoppingBasket, FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";

function Sitebar() {
  const location = useLocation();
  const statsActive = location.pathname.startsWith('/quan-tri/tong-quan') || location.pathname.startsWith('/quan-tri/quan-ly-giam-gia');
  const productsActive = location.pathname.startsWith('/quan-tri/san-pham') || location.pathname.startsWith('/quan-tri/loai-san-pham');
  const ordersActive = location.pathname.startsWith('/quan-tri/hoa-don');
  const functionsActive = location.pathname.startsWith('/quan-tri/quan-ly-tai-khoan') || location.pathname.startsWith('/quan-tri/banner') || location.pathname.startsWith('/quan-tri/quan-ly-ctv');
  const luckyActive = location.pathname.startsWith('/quan-tri/LuckyWheel');
  const CreateDiscountActive = location.pathname.startsWith('/quan-tri/tao-giam-gia');
  const [showStats, setShowStats] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showFunctions, setShowFunctions] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showLucky, setShowLucky] = useState(false);

  useEffect(() => {
    if (statsActive) setShowStats(true);
    if (productsActive) setShowProducts(true);
    if (ordersActive) setShowOrders(true);
    if (functionsActive) setShowFunctions(true);
    if (CreateDiscountActive) setShowDiscount(true);
  }, [statsActive, productsActive, ordersActive, functionsActive, CreateDiscountActive]);
  return (
    <div className={Style.container}>
      <div className={`${Style.Thunerdashboard} ${statsActive ? Style.activeBlock : ""}`}>
        <h3
          className={Style.TitleDashboard}
          onClick={() => setShowStats((s) => !s)}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <AiFillSignal style={{ paddingBottom: "4px" }} /> Thống kê {showStats ? "▾" : "▸"}
        </h3>
        {showStats && (
          <>
            <NavLink
              to="/quan-tri/tong-quan"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              Tổng quan
            </NavLink>
            <NavLink
              to="/quan-tri/quan-ly-giam-gia"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              Quản lý giảm giá
            </NavLink>
          </>
        )}
      </div>
      <div className={`${productsActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowProducts(s => !s)} style={{ cursor: 'pointer' }}>
          <FaCartShopping /> Sản phẩm {showProducts ? '▾' : '▸'}
        </h3>
        {showProducts && (
          <>
            <NavLink
              to="/quan-tri/san-pham"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              Tất cả sản phẩm
            </NavLink>
            <NavLink
              to="/quan-tri/loai-san-pham"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              Loại sản phẩm
            </NavLink>
          </>
        )}
      </div>
      <div className={`${ordersActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowOrders(s => !s)} style={{ cursor: 'pointer' }}>
          <FaShoppingBasket /> Đơn hàng {showOrders ? '▾' : '▸'}
        </h3>
        {showOrders && (
          <NavLink
            to="/quan-tri/hoa-don"
            className={({ isActive }) => (isActive ? Style.active : "")}
          >
            Tất cả đơn hàng
          </NavLink>
        )}
      </div>
      <div className={`${functionsActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowFunctions(s => !s)} style={{ cursor: 'pointer' }}>
          <FaUser style={{ paddingBottom: "4px" }} /> Chức năng {showFunctions ? '▾' : '▸'}
        </h3>
        {showFunctions && (
          <>
            <NavLink
              to="/quan-tri/quan-ly-tai-khoan"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              quản lý tài khoản
            </NavLink>
            <NavLink
              to="/quan-tri/quan-ly-ctv"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              quản lý CTV
            </NavLink>
            <NavLink
              to="/quan-tri/banner"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              Banner
            </NavLink>
          </>
        )}
      </div>
      <div className={`${CreateDiscountActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowDiscount(s => !s)} style={{ cursor: 'pointer' }}>
          <MdDiscount /> Tạo sự kiện {showDiscount ? '▾' : '▸'}
        </h3>
        {showDiscount && (
          <NavLink
            to="/quan-tri/tao-giam-gia"
            className={({ isActive }) => (isActive ? Style.active : "")}
          >
            Tạo giảm giá
          </NavLink>
        )}
      </div>
      <div className={`${luckyActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowLucky(s => !s)} style={{ cursor: 'pointer' }}>
          LuckyWheel {showLucky ? '▾' : '▸'}
        </h3>
        {showLucky && (
          <NavLink
            to="/quan-tri/LuckyWheel"
            className={({ isActive }) => (isActive ? Style.active : "")}
          >
            Vòng quay may mắn
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default Sitebar;
