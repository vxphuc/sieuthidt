import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography, Box, Input } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import style from "./CreateProduct.module.css";

function CreateProductForm() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://web-dt.onrender.com/typeProduct");
        setCategories(res.data.typeProducts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("typeProductId", product.category);
      if (image) {
        formData.append("image", image);
      }

      await axios.post("http://localhost:5000/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Product created successfully");
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
              margin="normal"
            >
              {categories.map((item) => (
                <MenuItem key={item._id} value={item._id} className={style.list}>
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
              label="Mô Tả"
              variant="outlined"
              name="description"
              multiline
              rows={4}
              value={product.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Chọn Ảnh</Typography>
            <Input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImageChange}
            />
            {image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                File: {image.name}
              </Typography>
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
