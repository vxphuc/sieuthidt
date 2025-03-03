import axios from "axios";
import { useEffect, useState } from "react";
import style from "./RecycleBin.module.css";
import { NavLink } from "react-router-dom";
function RecycleBin() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios
      .get("https://web-dt.onrender.com/product/Recycle-Bin")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  console.log(items)
  const handleRestore = (id) => {
    axios
      .patch(`https://web-dt.onrender.com/product/${id}/restore`)
      .then(()=>{
        window.location.reload()
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleDelete = (id) => {
    axios
      .delete(`https://web-dt.onrender.com/product/${id}/delete`)
      .then(()=>{
        window.location.reload()
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div className="container">
      <NavLink className='btn btn-success mb-2' to= '/quan-tri/san-pham'>Quay về</NavLink>
      <table className="table table-hover">
        <thead>
          <tr className="table-primary">
            <th scope="col">#</th>
            <th scope="col">Tên sản phẩm</th>
            <th scope="col">Giá</th>
            <th scope="col">Loại sản phẩm</th>
            <th scope="col">Thời gian xóa</th>
            <th scope="col">Ảnh sản phẩm</th>
            <th scope="col">tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{(item.typeProduct[0])?(item.typeProduct[0].name) : ''}</td>
                <td>{item.deletedAt}</td>
                <td>
                  <img
                    className={style.product_image}
                    src={`https://web-dt.onrender.com/uploads/${item.image}`}
                  ></img>
                </td>
                <td>
                  <button
                    onClick={() => {
                      handleRestore(item._id);
                    }}
                    className="btn btn-success ms-2"
                  >
                    {" "}
                    khôi phục
                  </button>
                  <button onClick={() =>{handleDelete(item._id)}} className="btn btn-danger ms-2"> Xóa</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RecycleBin;
