import { TextField, Button, Grid, Typography, Box, Input } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import style from './CreateProduct.module.css'

function CreateProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [data, setData] = useState([]);
  const [category, setCategory] = useState('');

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    axios
      .get("https://web-dt.onrender.com/typeProduct")
      .then(res => setData(res.data.typeProducts))
      .catch((error) => console.error(error));
  }, []);


  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleChangeImage = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("typeProductId", category);
    if (image) {
      formData.append("image", image); // Gửi file ảnh
    }

    axios
    .post("https://web-dt.onrender.com/product/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(() => {
      console.log("Product created successfully");
    })
    .catch((error) => {
      console.error("Error creating product:", error);
    });
  
  };

  

  return (
    <div>
      <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
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
                value={name}
                onChange={handleChangeName}
              />
            </Grid>

            <Grid item xs={12}>
      <TextField
        select
        fullWidth
        label="Chọn danh mục"
        margin="normal"
        name="typeProductId"
        value={category}
        onChange={handleChange}
      >
      {
        data.map((item, index)=>{

          return(
            <MenuItem key={index} value={item._id} className={style.list}>{item.name}</MenuItem>
          )
        })
      }
      </TextField>
    </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giá"
                variant="outlined"
                name="price"
                type="number"
                value={price}
                onChange={handleChangePrice}
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
                value={description}
                onChange={handleChangeDescription}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1">Chọn Ảnh</Typography>
              <Input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChangeImage}
              />
              {image && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  File: {image.name}
                </Typography>
              )}{" "}
              {/* Hiển thị tên file hình ảnh */}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Thêm Sản Phẩm
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
}

export default CreateProductForm;
