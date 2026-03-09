import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Style from "./Sitebar.module.css";
import { AiFillSignal } from "react-icons/ai";
import { FaGift, FaShoppingBasket, FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";

function Sitebar() {
  const location = useLocation();
  const statsActive = location.pathname.startsWith('/quan-tri/tong-quan') || location.pathname.startsWith('/quan-tri/quan-ly-giam-gia')
                       || location.pathname.startsWith('/quan-tri/top-san-pham-ban-chay') || location.pathname.startsWith('/quan-tri/thong-ke-nguoi-dung')
                       || location.pathname.startsWith('/quan-tri/thong-ke-doanh-thu') || location.pathname.startsWith('/quan-tri/danh-sach-koc-hoat-dong')
                       || location.pathname.startsWith('/quan-tri/san-pham-mua-nhieu-koc');
  const productsActive = location.pathname.startsWith('/quan-tri/san-pham') && !location.pathname.startsWith('/quan-tri/san-pham-mua-nhieu-koc') || location.pathname.startsWith('/quan-tri/loai-san-pham');
  const ordersActive = location.pathname.startsWith('/quan-tri/hoa-don');
  const functionsActive = location.pathname.startsWith('/quan-tri/quan-ly-tai-khoan') || location.pathname.startsWith('/quan-tri/banner') || location.pathname.startsWith('/quan-tri/quan-ly-ctv');
  const giftEventsActive = location.pathname.startsWith('/quan-tri/danh-sach-su-kien-doi-qua') || location.pathname.startsWith('/quan-tri/tao-ma-giam-gia-hang-loat')
                      || location.pathname.startsWith('/quan-tri/gan-ma-giam-gia-vao-su-kien') || location.pathname.startsWith('/quan-tri/tao-phan-thuong-cho-su-kien')
                      || location.pathname.startsWith('/quan-tri/danh-sach-dai-ly');
  const luckyActive = location.pathname.startsWith('/quan-tri/LuckyWheel');
  const CreateDiscountActive = location.pathname.startsWith('/quan-tri/tao-giam-gia');
  const [showStats, setShowStats] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showFunctions, setShowFunctions] = useState(false);
  const [showGiftEvents, setShowGiftEvents] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showLucky, setShowLucky] = useState(false);

  //Thong ke
  const [showStatsStore, setShowStatsStore] = useState(false);
  const [showStatsCTV, setShowStatsCTV] = useState(false);

  useEffect(() => {
    if (statsActive) setShowStats(true);

    // Thêm logic tự động mở menu con
    if (location.pathname.startsWith('/quan-tri/tong-quan')) setShowStatsStore(true);
    if (location.pathname.startsWith('/quan-tri/quan-ly-giam-gia')) setShowStatsCTV(true);

    if (productsActive) setShowProducts(true);
    if (ordersActive) setShowOrders(true);
    if (functionsActive) setShowFunctions(true);
    if (giftEventsActive) setShowGiftEvents(true);
    if (CreateDiscountActive) setShowDiscount(true);
  }, [statsActive, productsActive, ordersActive, functionsActive, giftEventsActive, CreateDiscountActive]);
  return (
    <div className={Style.container}>
      <div className={`${Style.Thunerdashboard} ${statsActive ? Style.activeBlock : ""}`}>
        <h3
          className={Style.TitleDashboard}
          onClick={() => setShowStats((s) => !s)}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <AiFillSignal style={{ paddingBottom: "4px" }} /> Thống kê {showStats}
        </h3>

        {showStats && (
          <div style={{ paddingLeft: "10px" }}>
            <div 
              className={Style.TitleDashboard} 
              onClick={() => setShowStatsStore(s => !s)}
              style={{ cursor: "pointer", userSelect: "none", fontSize: "1.1em", paddingTop: "5px" }}
            >
              Cửa hàng {showStatsStore}
            </div>
            {showStatsStore && (
              <>
                {/* Link Tổng quan cũ */}
                <NavLink
                  to="/quan-tri/tong-quan"
                  className={({ isActive }) => (isActive ? Style.active : "")}
                >
                  <div className={Style.ContentDashboard} style={{ paddingLeft: "15px" }}>• Tổng quan</div>
                </NavLink>
                <NavLink
                  to="/quan-tri/thong-ke-doanh-thu"
                  className={({ isActive }) => (isActive ? Style.active : "")}
                >
                  <div className={Style.ContentDashboard} style={{ paddingLeft: "15px" }}>• Doanh thu</div>
                </NavLink>
                <NavLink
                  to="/quan-tri/top-san-pham-ban-chay"
                  className={({ isActive }) => (isActive ? Style.active : "")}
                >
                  <div className={Style.ContentDashboard} style={{ paddingLeft: "15px" }}>• Top SP bán chạy</div>
                </NavLink>
                <NavLink
                  to="/quan-tri/thong-ke-nguoi-dung"
                  className={({ isActive }) => (isActive ? Style.active : "")}
                >
                  <div className={Style.ContentDashboard} style={{ paddingLeft: "15px" }}>• Thống kê người dùng</div>
                </NavLink>
              </>
            )}
            <div 
              className={Style.TitleDashboard} 
              onClick={() => setShowStatsCTV(s => !s)}
              style={{ cursor: "pointer", userSelect: "none", fontSize: "1.1em", paddingTop: "5px" }}
            >
              CTV {showStatsCTV}
            </div>
            {showStatsCTV && (
              <>
              <NavLink
                to="/quan-tri/quan-ly-giam-gia"
                className={({ isActive }) => (isActive ? Style.active : "")}
              >
                <div className={Style.ContentDashboard} style={{ paddingLeft: "15px" }}>• Quản lý giảm giá</div>
              </NavLink>
              <NavLink
                to="/quan-tri/san-pham-mua-nhieu-koc"
                className={({ isActive }) => (isActive ? Style.active : "")}
              >
                <div className={Style.ContentDashboard} style={{ paddingLeft: "15px" }}>• Sản phẩm mua nhiều</div>
              </NavLink>
              <NavLink
                to="/quan-tri/danh-sach-koc-hoat-dong"
                className={({ isActive }) => (isActive ? Style.active : "")}
              >
                <div className={Style.ContentDashboard} style={{ paddingLeft: "15px" }}>• Danh sách CTV</div>
              </NavLink>
              </>
            )}

          </div>
        )}
      </div>
      <div className={`${productsActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowProducts(s => !s)} style={{ cursor: 'pointer' }}>
          <FaCartShopping /> Sản phẩm {showProducts}
        </h3>
        {showProducts && (
          <>
            <NavLink
              to="/quan-tri/san-pham"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <div className={Style.ContentDashboard}>Tất cả sản phẩm</div>
            </NavLink>
            <NavLink
              to="/quan-tri/loai-san-pham"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <div className={Style.ContentDashboard}>Loại sản phẩm</div>
            </NavLink>
          </>
        )}
      </div>
      <div className={`${ordersActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowOrders(s => !s)} style={{ cursor: 'pointer' }}>
          <FaShoppingBasket /> Đơn hàng {showOrders}
        </h3>
        {showOrders && (
          <NavLink
            to="/quan-tri/hoa-don"
            className={({ isActive }) => (isActive ? Style.active : "")}
          >
            <div className={Style.ContentDashboard}>Tất cả đơn hàng</div>
          </NavLink>
        )}
      </div>
      <div className={`${functionsActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowFunctions(s => !s)} style={{ cursor: 'pointer' }}>
          <FaUser style={{ paddingBottom: "4px" }} /> Chức năng {showFunctions}
        </h3>
        {showFunctions && (
          <>
            <NavLink
              to="/quan-tri/quan-ly-tai-khoan"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <div className={Style.ContentDashboard}>quản lý tài khoản</div>
            </NavLink>
            <NavLink
              to="/quan-tri/quan-ly-ctv"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <div className={Style.ContentDashboard}>quản lý CTV</div>
            </NavLink>
            <NavLink
              to="/quan-tri/banner"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <div className={Style.ContentDashboard}>Banner</div>
            </NavLink>
          </>
        )}
      </div>
      <div className={`${CreateDiscountActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowDiscount(s => !s)} style={{ cursor: 'pointer' }}>
          <MdDiscount /> Tạo sự kiện {showDiscount}
        </h3>
        {showDiscount && (
          <NavLink
            to="/quan-tri/tao-giam-gia"
            className={({ isActive }) => (isActive ? Style.active : "")}
          >
            <div className={Style.ContentDashboard}>Tạo giảm giá</div>
          </NavLink>
        )}
      </div>
      <div className={`${giftEventsActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowGiftEvents(s => !s)} style={{ cursor: 'pointer' }}>
          <FaGift style={{ paddingBottom: "4px" }} /> Đổi Quà {showGiftEvents}
        </h3>
        {showGiftEvents && (
          <>
            <NavLink
              to="/quan-tri/danh-sach-su-kien-doi-qua"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <div className={Style.ContentDashboard}>Danh sách sự kiện</div>
            </NavLink>
            <NavLink
              to="/quan-tri/tao-ma-giam-gia-hang-loat"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <div className={Style.ContentDashboard}>Tạo mã giảm giá hàng loạt</div>
            </NavLink>
            <NavLink
              to="/quan-tri/gan-ma-giam-gia-vao-su-kien"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <div className={Style.ContentDashboard}>Gán mã giảm giá</div>
            </NavLink>
            <NavLink
              to="/quan-tri/tao-phan-thuong-cho-su-kien"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <div className={Style.ContentDashboard}>Tạo phần thưởng</div>
            </NavLink>
            <NavLink
              to="/quan-tri/danh-sach-dai-ly"
              className={({ isActive }) => (isActive ? Style.active : "")}
            >
              <div className={Style.ContentDashboard}>Danh sách đại lý</div>
            </NavLink>
          </>
        )}
      </div>
      <div className={`${luckyActive ? Style.activeBlock : ""}`}>
        <h3 className={Style.TitleDashboard} onClick={() => setShowLucky(s => !s)} style={{ cursor: 'pointer' }}>
          LuckyWheel {showLucky}
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
