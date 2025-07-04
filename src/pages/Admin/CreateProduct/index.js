import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography, Box, Input } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import style from "./CreateProduct.module.css";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import api from "../../../api/axios";
function CreateProductForm() {
  const [editorData, setEditorData] = useState("");
  const navigate = useNavigate();

  // State lưu thông tin sản phẩm
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    quantity: "",
    discount: "",
  });

  // State lưu danh sách các file ảnh được chọn
  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load danh sách các category từ server
    const fetchCategories = async () => {
      try {
        const res = await api.get("/typeProduct");
        setCategories(res.data.typeProducts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // Hàm xử lý khi thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi người dùng chọn nhiều ảnh
  const handleImageChange = (e) => {
    // Lấy tất cả file ảnh từ input
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("typeProductId", product.category);
      formData.append("quantity", product.quantity);
      formData.append("discount", product.discount);

      // Thêm nhiều ảnh vào formData bằng vòng lặp
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      // gửi yêu cầu tới server
      await api.post("/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Product created successfully");
      navigate("/quan-tri/san-pham");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Thêm Sản Phẩm
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên Sản Phẩm"
              variant="outlined"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Chọn danh mục"
              name="category"
              value={product.category}
              onChange={handleChange}
            >
              {categories.map((item) => (
                <MenuItem
                  key={item._id}
                  value={item._id}
                  className={style.list}
                >
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Giá"
              variant="outlined"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="% giảm giá nếu có"
              variant="outlined"
              name="discount"
              type="number"
              value={product.discount}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Số lượng"
              variant="outlined"
              name="quantity"
              type="number"
              value={product.quantity}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">Mô Tả</Typography>
            <CKEditor
              editor={ClassicEditor}
              data={product.description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setProduct((prev) => ({ ...prev, description: data }));
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">Chọn Nhiều Ảnh</Typography>
            <Input
              type="file"
              accept="image/*"
              name="images"
              onChange={handleImageChange}
              inputProps={{ multiple: true }} // Cho phép chọn nhiều ảnh
            />

            {/* Hiển thị danh sách ảnh đã chọn */}
            {images.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Các file đã chọn:</Typography>
                <ul>
                  {Array.from(images).map((img, index) => (
                    <li key={index}>{img.name}</li>
                  ))}
                </ul>
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Thêm Sản Phẩm
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default CreateProductForm;
