import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import style from "./productAdmin.module.css";
import Pagination from "../../../components/Pagination";
import api from "../../../api/axios";

function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const query = searchTerm.trim()
      ? `&search=${encodeURIComponent(searchTerm.trim())}`
      : "";

    api
      .get(`/product?page=${currentPage}${query}`)
      .then((res) => {
        setProducts(res.data);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
  }, [currentPage, searchTerm]);

  const handleDeleted = (id) => {
    api
      .patch(`/product/${id}/destroy`)
      .then(() => {
        window.location.href = "/quan-tri/san-pham";
      })
      .catch((error) => {
        console.error("Lỗi khi xóa dữ liệu:", error);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <div className={style.header}>
          <div>
            <h2 className={style.title}>Quản lý sản phẩm</h2>
            <p className={style.subtitle}>
              Theo dõi, tìm kiếm và cập nhật danh sách sản phẩm
            </p>
          </div>
        </div>

        <div className={style.toolbar}>
          <div className={style.searchBox}>
            <input
              type="text"
              className={style.searchInput}
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className={style.actionGroup}>
            <NavLink
              to="/quan-tri/san-pham/them-moi-san-pham"
              className={`${style.btn} ${style.btnPrimary}`}
            >
              Thêm mới sản phẩm
            </NavLink>
            <NavLink
              to="/quan-tri/san-pham/thung-rac"
              className={`${style.btn} ${style.btnDanger}`}
            >
              Thùng rác ({products.count ? products.count : "0"})
            </NavLink>
          </div>
        </div>

        <div className={style.tableWrapper}>
          <table className={style.table}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Giá</th>
                <th scope="col">Loại sản phẩm</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Ảnh sản phẩm</th>
                <th scope="col">Giảm giá</th>
                <th scope="col">Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {products.results && Array.isArray(products.results) ? (
                products.results.map((product, index) => {
                  const productPrice = Number.parseFloat(product.price);
                  const typeProduct =
                    product.typeProduct?.map((item) => item.name).join(", ") ||
                    "Chưa phân loại";
                  const productImage = product.image?.[0];

                  return (
                    <tr key={product._id}>
                      <th scope="row">{index + 1}</th>
                      <td className={style.productName}>{product.name}</td>
                      <td>
                        {productPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>{typeProduct}</td>
                      <td>{product.quantity}</td>
                      <td>
                        {productImage ? (
                          <img
                            className={style.productImage}
                            src={productImage}
                            alt={product.name}
                          />
                        ) : (
                          <span className={style.emptyText}>Chưa có ảnh</span>
                        )}
                      </td>
                      <td>{product.discount}%</td>
                      <td>
                        <div className={style.rowActions}>
                          <NavLink className={`${style.btnSmall} ${style.btnOutline}`}>
                            Xem chi tiết
                          </NavLink>
                          <NavLink
                            to={`/quan-tri/san-pham/${product.slug}/cap-nhap-san-pham`}
                            className={`${style.btnSmall} ${style.btnPrimary}`}
                          >
                            Sửa
                          </NavLink>
                          <button
                            onClick={() => handleDeleted(product._id)}
                            className={`${style.btnSmall} ${style.btnDanger}`}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className={style.emptyRow}>
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={style.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductAdmin;
