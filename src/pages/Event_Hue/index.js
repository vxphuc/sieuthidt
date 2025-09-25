import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
function Event() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/login"); // chuyển sang trang đăng nhập
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Giới thiệu về "DT GROUP"
      </Typography>

      {/* Video responsive với maxWidth 90% trên desktop */}
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%", // giữ tỉ lệ 16:9
          height: "auto",
          overflow: "hidden",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "90%", // desktop tối đa 90%
          margin: "0 auto" // căn giữa
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/lB-gCcpSzt0?si=IZhVR8ypbj8aTqwf"
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
            height: "100%"
          }}
        ></iframe>
      </div>
      <img
        src="/z7048707123874_020c0bed38fd5e4c8486f5f6322b448a.jpg"
        alt="Giới thiệu DT Group"
        style={{
          marginTop: "20px",
          width: "100%",
          maxWidth: "90%",
          borderRadius: "8px"
        }}
      />
    </div>
  );
}

export default Event;
