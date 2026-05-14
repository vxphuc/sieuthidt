import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import style from "./ShowBanner.module.css";
import api from "../../../api/axios";
import { getImageUrl } from "../../../utils/imageUrl";
function ShowBanner() {
  const [dataBanner, setDataBanner] = useState([]);

  useEffect(() => {
    api
      .get("/sign-in/banner")
      .then((res) => setDataBanner(res.data));
  }, []);

  const handledelete = async (id) => {
  try {
    await api.delete(`/sign-in/banner/${id}/delete`);
    const dt = await api.get("/sign-in/banner");
    setDataBanner(dt.data);
  } catch (err) {
    console.error("Lỗi khi xóa banner:", err);
  }
};

  return (
    <div>
      <NavLink className="btn btn-primary" to="/quan-tri/them-moi-banner">
        Thêm mới banner
      </NavLink>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">banner</th>
            <th scope="col">Thời gian tạo</th>
            <th scope="col">chức năng</th>
          </tr>
        </thead>
        <tbody>
          {dataBanner.map((banner, index) => {
            return (
              <tr key={banner._id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <img
                    width="300px"
                    height="200px"
                    src={getImageUrl(banner.image)}
                  ></img>
                </td>
                <td>{banner.dateCreate}</td>
                <td>
                  <button
                    onClick={() => handledelete(banner.id)}
                    className={`btn btn-danger`}
                  >
                    Xóa
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

export default ShowBanner;
