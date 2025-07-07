import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import style from "./productAdmin.module.css";
import Pagination from "../../../components/Pagination";
import api from "../../../api/axios";
function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    api
      .get(`/product?page=${currentPage}`)
      .then((res) => {
        setProducts(res.data);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
  }, [currentPage]);

  const handldeleted = (id) => {
    api
      .patch(`/product/${id}/destroy`)
      .then(() => {
        window.location.href = "/quan-tri/san-pham";
      })
      .catch((error) => {
        console.error("Lỗi khi xóa dữ liệu:", error);
      });
  };

  return (
    <div className="container">
      <div className="mb-2">
        <NavLink
          to="/quan-tri/san-pham/them-moi-san-pham"
          className="btn btn-primary "
        >
          {" "}
          Thêm mới sản phẩm
        </NavLink>
        <NavLink
          to="/quan-tri/san-pham/thung-rac"
          className="btn btn-danger ms-2"
        >
          {` Thùng rác (${products.count ? products.count : "0"}) `}
        </NavLink>
      </div>
      <table className="table table-hover">
        <thead>
          <tr className="table-primary">
            <th scope="col">#</th>
            <th scope="col">Tên sản phẩm</th>
            <th scope="col">Giá</th>
            <th scope="col">Loại sản phẩm</th>
            <th scope="col">số lượng sản phẩm</th>
            <th scope="col">Ảnh sản phẩm</th>
            <th scope="col">Giảm giá</th>
            <th scope="col">tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {products.results && Array.isArray(products.results) ? (
            products.results.map((product, index) => {
              const parseFloat = Number.parseFloat(product.price);
              let typeProduct;
              for (let i = 0; i < product.typeProduct.length; i++) {
                typeProduct = product.typeProduct[i].name;
              }
              return (
                <tr key={product._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{product.name}</td>
                  <td>
                    {parseFloat.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>{typeProduct}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <img
                      className={style.product_image}
                      src={`${product.image[0]}`}
                    ></img>
                  </td>
                  <td>
                    {product.discount}%
                  </td>
                  <td>
                    <NavLink className="btn btn-primary ">
                      {" "}
                      Xem chi tiết
                    </NavLink>
                    <NavLink
                      to={`/quan-tri/san-pham/${product.slug}/cap-nhap-san-pham`}
                      className="btn btn-success ms-2"
                    >
                      {" "}
                      Sửa
                    </NavLink>
                    <button
                      onClick={() => handldeleted(product._id)}
                      className="btn btn-danger ms-2"
                    >
                      {" "}
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Không có sản phẩm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default ProductAdmin;
