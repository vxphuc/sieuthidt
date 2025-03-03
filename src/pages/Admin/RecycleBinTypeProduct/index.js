import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function RecycleBinTyproduct() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://web-dt.onrender.com/typeProduct/delete-typeProduct")
      .then((res) => setData(res.data))
      .catch((error) => console.log(error));
  }, []);
  console.log(data);
  return (
    <div className={`container`}>
      <NavLink to={`/quan-tri/loai-san-pham`} className={`btn btn-success`}>
        Quay lại
      </NavLink>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            let date = new Date(item.deleteAt);
            console.log(date.toLocaleString('vi-VN'));
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>
                  <img
                    src={`https://web-dt.onrender.com/uploads/${item.image}`}
                  ></img>
                </td>
                <td>{date.toLocaleString('vi-VN')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RecycleBinTyproduct;
