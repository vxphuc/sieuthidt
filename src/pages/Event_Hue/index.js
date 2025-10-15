import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Typography } from "@mui/material";

function Event() {
  const [showVideo, setShowVideo] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Hiển thị video sau 500ms để bắt đầu hiệu ứng
    const videoTimer = setTimeout(() => {
      setShowVideo(true);
    }, 500);

    // Hiển thị tiêu đề sau 2.5 giây (500ms ban đầu + 2s bạn yêu cầu)
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 500);

    // Dọn dẹp timer khi component unmount để tránh rò rỉ bộ nhớ
    return () => {
      clearTimeout(videoTimer);
      clearTimeout(titleTimer);
    };
  }, []);
  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showVideo]);

  return (
    <div
      className="event-hue"
      style={{
        position: "relative",
        width: "100%",
        height: "300vh",
        backgroundImage: `url('./z7097736629101_5651aa0ad003a96b2eb3564d621f4378.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Định nghĩa animation bằng CSS ngay trong component */}
      <style>
        {`
          .element-hidden {
            opacity: 0;
            transform: translateY(20px);
          }
          .event-content-mobile{
            top: 0% !important;
          }
          .element-visible {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out;
            border-radius: 12px;
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          @media screen and (max-width: 768px) {

            .event-content-mobile {
              width: 90% !important;
              top: -18% !important;
            }
            .logo-link-mobile {
              padding-top: 0px;
              margin-top: 88px;
            }
            .event-hue {
              width: 100vw !important;
              height: 100vh !important;
            }
          }
        `}
      </style>

      <div
        className="event-content-mobile"
        style={{
          position: "relative",
          width: "60%",
          zIndex: 1,
          top: "-23%",
        }}
      >
        <div>
          <NavLink to="/" className="logo-link-mobile">
            <video width={"213"} height={"90"} autoPlay muted>
              <source src="./7097482658362.mp4"></source>
            </video>
          </NavLink>
        </div>
        

        <div style={{ background: "green", borderRadius: "12px" }}>
          <h6
            // Sử dụng cả lớp hidden và visible cho tiêu đề
            className={`element-hidden ${showTitle ? "element-visible" : ""}`}
            style={{
              fontFamily: "sans-serif !important",
              backgroundColor: "green",
              color: "white",
              fontSize: "18px !important",
              fontWeight: "bold !important",
            }}
            variant="h6"
            gutterBottom
          >
            <p
              style={{ fontSize: "18px", marginBottom: "-6px", padding: "5px" }}
            >
              Giới thiệu về "DT GROUP"
            </p>
          </h6>

          <div
            ref={videoRef}
            // Sử dụng cả lớp hidden và visible để tạo hiệu ứng chuyển động
            className={`element-hidden ${showVideo ? "element-visible" : ""}`}
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: "0",
              overflow: "hidden",
              borderRadius: "0px",
              width: "100%",
              // maxWidth: "640px",
              // margin: "0 auto",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/lB-gCcpSzt0?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></iframe>
          </div>
          <h6
            // Sử dụng cả lớp hidden và visible cho tiêu đề
            className={`element-hidden ${showTitle ? "element-visible" : ""}`}
            style={{
              fontFamily: "sans-serif !important",
              backgroundColor: "green",
              color: "white",
              fontSize: "10px !important",
              fontWeight: "bold !important",
              height: "50px",
              marginBottom: "-6px",
              padding: "5px",
            }}
            variant="h6"
            gutterBottom
          >
            <p
              style={{
                fontSize: "12px",
                marginBottom: "0",
                fontWeight: "bold",
              }}
            >
              Kết Nối Thương Mại
            </p>
            {/* Sửa đổi ở đây */}
            <a
              href="https://zalo.me/0848726666"
              style={{ textDecoration: "none", color: "white" }}
            >
              <p style={{ marginTop: "6px" }}>0848.726.666 - Mr. Du</p>
            </a>
          </h6>
        </div>
      </div>
      <NavLink
        to="/"
        className={`element-hidden ${showTitle ? "element-visible" : ""}`}
        style={{
          backgroundColor: "#2e7d32", // Màu xanh lá cây đậm
          border: "solid 1px",
          color: "white",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "12px 24px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          marginTop: "63px",
          // Thêm animation nảy
          animation: showTitle ? "bounce 2s infinite" : "none",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1b5e20"; // Đổi màu khi di chuột vào
          e.target.style.transform = "translateY(-2px)"; // Tạo hiệu ứng nâng lên
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#2e7d32";
          e.target.style.transform = "translateY(0)";
        }}
      >
        Xem Thêm
      </NavLink>
    </div>
  );
}

export default Event;
