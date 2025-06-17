import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import axios from "axios";

const CreateBanner = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Lưu file để gửi lên server
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return alert("Vui lòng chọn ảnh trước!");

    const formData = new FormData();
    formData.append("image", imageFile); // Gửi file ảnh lên server

    setUploading(true);
    try {
      const response = await axios.post("https://dtweb.onrender.com/sign-in/upload-banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Ảnh đã được tải lên thành công!");
      window.location.href = '/quan-tri/banner'
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      alert("Tải ảnh lên thất bại!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Button variant="contained" component="label">
        Chọn ảnh
        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
      </Button>

      {image && (
        <Box mt={2}>
          <Typography variant="body1">{imageName}</Typography>
          <img
            src={image}
            alt="Ảnh đã chọn"
            style={{
              width: "100%",
              maxHeight: 200,
              objectFit: "cover",
              borderRadius: 8,
              marginTop: 10,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploading}
            sx={{ mt: 2 }}
          >
            {uploading ? "Đang tải lên..." : "Gửi ảnh lên server"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CreateBanner;
