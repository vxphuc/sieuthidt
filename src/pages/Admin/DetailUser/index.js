import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../api/axios";
const DetailUser = () => {
  const { uid } = useParams();
  const [user, setUser] = useState({});
  const [adress, setAddress] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(
          `/sign-in/user-profile-admin/${uid}`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [uid]);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("UID truyền lên là:", uid);
      try {
        const response = await api.get(
          `/address/user-address/${uid}`,
          {
            withCredentials: true,
          }
        );
        console.log("Địa chỉ người dùng:", response.data);
        setAddress(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [uid]);
  return (
    <div>
      <div>
        <div>
          <h3>Chi tiết tài khoản {uid}</h3>
          <div className="row">
            <div className="col-md-5 bg-light-subtle mt-3">
              <h5>Thông tin người dùng</h5>
              <div>
                <p>Tên: {user.name || "Đang tải..."}</p>
                <p>Số điện thoại: {user.numberPhone || "Đang tải..."}</p>
                <p>Điểm tích lũy: {user.token || "Đang tải..."}</p>
                <p>Phân quyền: {user.role || "Đang tải..."}</p>
              </div>
            </div>
            <div className="col-md-6 bg-light-subtle mt-3"></div>
          </div>
        </div>
        <div>
          <div>
            <div className="col-md-5 bg-light-subtle mt-3">
              <h5>Thông tin địa chỉ</h5>
              <div>
                {adress.map((address, index) => (
                  <div className="d-flex p-2" key={address._id}>
                    <p>
                      Địa chỉ: {address?.nameRoad} {address?.wards?.nameWards}{" "}
                      {address?.districts?.nameDistricts}{" "}
                      {address?.provinces?.nameProvinces}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
