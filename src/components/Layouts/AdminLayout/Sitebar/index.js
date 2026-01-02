import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Style from "./Sitebar.module.css";

function Sitebar() {
  const location = useLocation();
  const statsActive = location.pathname.startsWith('/quan-tri/tong-quan');
  const productsActive = location.pathname.startsWith('/quan-tri/san-pham') || location.pathname.startsWith('/quan-tri/loai-san-pham');
  const ordersActive = location.pathname.startsWith('/quan-tri/hoa-don');
  const functionsActive = location.pathname.startsWith('/quan-tri/quan-ly-tai-khoan') || location.pathname.startsWith('/quan-tri/banner');
  const luckyActive = location.pathname.startsWith('/quan-tri/LuckyWheel');

  const [showStats, setShowStats] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showFunctions, setShowFunctions] = useState(false);
  const [showLucky, setShowLucky] = useState(false);

  useEffect(() => {
    if (statsActive) setShowStats(true);
    if (productsActive) setShowProducts(true);
    if (ordersActive) setShowOrders(true);
    if (functionsActive) setShowFunctions(true);
    if (luckyActive) setShowLucky(true);
  }, [statsActive, productsActive, ordersActive, functionsActive, luckyActive]);
  return (
    <div className="container color-red">
      <div className={`${Style.Thunerdashboard} ${statsActive ? Style.activeBlock : ""}`}>
        <h3
          className={Style.TitleDashboard}
          onClick={() => setShowStats((s) => !s)}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          Thống kê {showStats ? "▾" : "▸"}
        </h3>
        {showStats && (
          <NavLink
            to="/quan-tri/tong-quan"
            className={({ isActive }) => (isActive ? Style.active : "")}
          >
            Tổng quan
          </NavLink>
        )}
      </div>
      <div className={`${productsActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowProducts(s => !s)} style={{ cursor: 'pointer' }}>
          Sản phẩm {showProducts ? '▾' : '▸'}
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
          Đơn hàng {showOrders ? '▾' : '▸'}
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
          Chức năng {showFunctions ? '▾' : '▸'}
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
              to="/quan-tri/banner"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              Banner
            </NavLink>
          </>
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
