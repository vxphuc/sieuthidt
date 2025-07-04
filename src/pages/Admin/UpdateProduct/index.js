import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./UpdateProduct.module.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import api from "../../../api/axios";
function UpdateProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState([]);

  // Fetch dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(
          `/product/${slug}`
        );
        if (!response.data) throw new Error("Không tìm thấy sản phẩm!");

        // Kiểm tra nếu response là mảng hay object
        const product = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        setData(product);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Fetch danh sách loại sản phẩm
  useEffect(() => {
    const fetchTypeProducts = async () => {
      try {
        const response = await api.get(
          "/typeProduct"
        );
        if (response.data) setType(response.data.typeProducts);
      } catch (error) {
        console.error("Lỗi khi tải loại sản phẩm:", error);
      }
    };
    fetchTypeProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu dữ liệu chưa đầy đủ
    if (
      !data?.name ||
      !data?.price ||
      !data?.description ||
      !data?.typeProductId
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("typeProductId", data.typeProductId);
    formData.append("discount", data.discount);
    formData.append("quantity", data.quantity);
    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      await api.put(
        `/product/${data._id}/fixProduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/quan-tri/san-pham");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };
  console.log(data);

  if (loading) return <div>Đang tải...</div>;
  if (!data) return <div>Không tìm thấy sản phẩm</div>;
  console.log(data);
  return (
    <div className={`container ${style.container}`}>
      <div className="text-center">
        <h1>Cập nhật sản phẩm</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tên sản phẩm */}
        <div>
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={data.name || ""}
            onChange={handleChange}
          />
        </div>

        {/* Danh mục */}
        <div>
          <label>Danh mục</label>
          <select
            className="form-select"
            name="typeProductId"
            value={data.typeProductId ?? ""}
            onChange={handleChange}
          >
            <option value="">{"Chọn danh mục"}</option>
            {type.map((value) => (
              <option key={value._id} value={value._id}>
                {value.name}
              </option>
            ))}
          </select>
        </div>

        {/* Giá sản phẩm */}
        <div>
          <label className="form-label">Giá sản phẩm</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={data.price || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="form-label">Số lượng</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={data.quantity ?? ""}
            onChange={handleChange}
          />
        </div>

        {/* Miêu tả sản phẩm */}
        <div>
          <label className="form-label">Miêu tả sản phẩm</label>
          <CKEditor
            editor={ClassicEditor}
            data={data.description || ""}
            onChange={(event, editor) => {
              const value = editor.getData();
              setData((prev) => ({
                ...prev,
                description: value,
              }));
            }}
          />
        </div>

        <div>
          <label className="form-label">Giảm giá (nếu không có thì nhập là 0)</label>
          <input
            type="number"
            className="form-control"
            name="discount"
            value={data.discount ?? ""}
            onChange={handleChange}
          />
        </div>

        {/* Ảnh sản phẩm */}
        {/* <div>
          <label className="form-label">Chọn ảnh</label>
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={(e) =>
              setData((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />
          <img src={`${data.image}`} width={`20%`}></img>
        </div> */}

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

export default UpdateProduct;
