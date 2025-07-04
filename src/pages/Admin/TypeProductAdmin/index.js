import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
import style from "./TypeProduc.module.css";
import api from "../../../api/axios";
function TypeProductAdmin() {
  const [data, setData] = useState([]);
  const [countDelete, setCountDelete] = useState(0);
  useEffect(() => {
    api
      .get("/typeProduct")
      .then((res) => {
        setData(res.data.typeProducts);
        setCountDelete(res.data.count)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
  const handleDelete = async (e) =>{
       api.patch(`/typeProduct/delete-sort/${e}`)
        .then((res) => {
          console.log('update successFully', res.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        })
  }

  return (
    <div className="container">
      <NavLink
        className="btn btn-primary mb-2"
        to="/quan-tri/loai-san-pham/them-moi"
      >
        Thêm mới 
      </NavLink>
      <NavLink
        className="btn btn-danger mb-2 ms-2"
        to="/quan-tri/loai-san-pham/thung-rac"
      >
        Thùng rác ({countDelete})
      </NavLink>
      <table className="table table-hove">
        <thead>
          <tr className="table-primary">
            <th scope="col">#</th>
            <th scope="col">Tên loại sản phẩm</th>
            <th scope="col">ảnh</th>
            <th scope="col">Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>
                  <img
                    className={style.product_image}
                    src={`${item.image}`}
                  ></img>
                </td>
                <td>
                  <NavLink className="btn btn-Success ms-2">
                    Xem chi tiết
                  </NavLink>
                  <NavLink to={`/quan-tri/cap-nhap-loai-san-pham/${item._id}`} className="btn btn-primary ms-2">Sửa</NavLink>
                  <button onClick={()=>{handleDelete(item._id)}} className="btn btn-danger ms-2">Xóa</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TypeProductAdmin;
