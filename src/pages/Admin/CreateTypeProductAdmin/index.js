import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

import axios from "axios";

function CreateTypeProductAdmin() {
    const [formData, setFormData] = useState({
        name: "",
        image: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleChangeSubmit = (e) => {
      e.preventDefault();
      axios.post('https://web-dt.onrender.com/typeProduct/create',{
        name: formData.name,
        image: formData.image
      },{
        headers: {"Content-Type": "multipart/form-data"}
      })
        .then(response =>{
          console.log(response.data);
          window.location.href = "/quan-tri/loai-san-pham"; 
        })
        .catch((error) => {
          console.error(error);
        })
    }
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    p: 3,
                    mt: 5,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Thêm Loại Sản Phẩm
                </Typography>

                <form onSubmit={handleChangeSubmit} >
                    <TextField
                        fullWidth
                        label="Tên loại sản phẩm"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <Button variant="contained" component="label" sx={{ mt: 2 }}>
                        Chọn Hình Ảnh
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            name="image"
                            onChange={handleFileChange}
                        />
                    </Button>
                    {formData.image && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Đã chọn: {formData.image.name}
                        </Typography>
                    )}

                    <Button variant="contained" type="submit" color="primary" sx={{ mt: 2 }}>
                        Lưu
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default CreateTypeProductAdmin;
