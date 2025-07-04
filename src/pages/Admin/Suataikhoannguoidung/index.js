import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../api/axios";
function Suataikhoannguoidung() {
  const { uid } = useParams();
  const [user, setUser] = useState({
    name: "",
    role: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setSuccess(false);
        setError(null);
        const response = await api.get(
          `/sign-in/user-profile-admin/${uid}`,
          { withCredentials: true }
        );
        setUser({
          name: response.data.name || "",
          role: response.data.role || "",
        });
      } catch (error) {
        setError("Không tìm thấy user!");
      }
    };
    if (uid) fetchUser();
  }, [uid]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(e.target.name)
  };
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    try {
      const response = await api.put(
        `/sign-in/${uid}/editUserByAdmin`,
        user,
        { withCredentials: true }
      );
      if (response) {
        setSuccess(true);
      } else {
        throw new Error();
      }
    } catch (err) {
      setError("Cập nhật thất bại!");
    }
  };

  return (
    <form style={{ maxWidth: 500, margin: "0 auto" }} onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Mã tài khoản</label>
        <input
          type="text"
          className="form-control"
          value={uid || ""}
          readOnly
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Họ và tên</label>
        <input
          type="text"
          className="form-control"
          name="name"
          required
          value={user.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Phân quyền</label>
        <select
          className="form-select"
          name="role"
          required
          value={user.role}
          onChange={handleChange}
        >
          <option value="">--- chọn option---</option>
          <option value="admin">admin</option>
          <option value="user">user</option>
          <option value="editor">editor</option>
          {/* Thêm các phân quyền khác nếu có */}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Lưu thay đổi
      </button>
      {success && (
        <div className="alert alert-success mt-3">Cập nhật thành công!</div>
      )}
      {error && (
        <div className="alert alert-danger mt-3">{error}</div>
      )}
    </form>
  );
}

export default Suataikhoannguoidung;
