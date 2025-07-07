import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../api/axios";
function RecycleBinTyproduct() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    api
      .get("/typeProduct/delete-typeProduct")
      .then((res) => setData(res.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRestore = (id) => {
    api
      .patch(`/typeProduct/restore/${id}`)
      .then(() => {
        fetchData();
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (id) => {
    api.delete(`/typeProduct/delete/${id}`)
    .then(() => {
      fetchData()
    })
    .catch((error) => console.error(error));
  };

  return (
    <div className={`container`}>
      <NavLink to={`/quan-tri/loai-san-pham`} className={`btn btn-success`}>
        Quay lại
      </NavLink>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">tên</th>
            <th scope="col">Hình ảnh</th>
            <th scope="col">ngày xóa</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            let date = new Date(item.deleteAt);
            return (
              <tr key={item._id}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>
                  <img
                  width={`100px`}
                  height={`100px`}
                    src={`${item.image}`}
                  ></img>
                </td>
                <td>{date.toLocaleString("vi-VN")}</td>
                <td>
                  <button
                    onClick={() => handleRestore(item._id)}
                    className="btn btn-primary"
                  >
                    khôi phục
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-danger ms-2"
                  >
                    Xóa vĩnh viễn
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RecycleBinTyproduct;
