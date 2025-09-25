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

      {/* Video responsive */}
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "8px" }}>
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
    </div>
  );
}

export default Event;
