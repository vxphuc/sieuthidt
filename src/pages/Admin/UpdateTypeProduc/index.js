import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../api/axios";
function UpdateTypeProduc() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/typeProduct/detailTypeProduct/${id}`)
      .then((res) => {
        const result = Array.isArray(res.data) ? res.data[0] : res.data;
        setData(result);
      })
      .catch(console.log("lỗi kết nối server"));
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image) {
      formData.append("image", data.image);
    }
    try {
     await api.put(`/typeProduct/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate ("/quan-tri/loai-san-pham", { replace: true })
    } catch {
      console.log("lỗi");
    }
  };
  console.log(data);
  const handleChane = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`container `}>
      <div className="text-center">
        <h1>Cập nhật sản phẩm</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tên sản phẩm */}
        <div>
          <label className="form-label">Tên loại sản phẩm</label>
          <input
            type="text"
            className="form-control"
            name="name"
            onChange={handleChane}
            value={data?.name || ""}
          />
        </div>

        {/* Ảnh sản phẩm */}
        <div>
          <label className="form-label">Chọn ảnh</label>
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={(e) =>
              setData((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />
        </div>

        {/* Nút cập nhật */}
        <div className="text-end">
          <button type="submit" className="btn btn-primary">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateTypeProduc;
