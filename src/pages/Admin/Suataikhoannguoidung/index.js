function Suataikhoannguoidung() {
    return (  <form  style={{ maxWidth: 500, margin: "0 auto" }}>
      <div className="mb-3">
        <label className="form-label">Mã tài khoản</label>
        <input
          type="text"
          className="form-control"
          
          readOnly
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Họ và tên</label>
        <input
          type="text"
          className="form-control"
          
          
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Số điện thoại</label>
        <input
          type="tel"
          className="form-control"
          
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Phân quyền</label>
        <select
          className="form-select"
          
          required
        >
          <option value="admin">admin</option>
          <option value="user">user</option>
          <option value="editor">editor</option>
          {/* Thêm các phân quyền khác nếu có */}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Lưu thay đổi
      </button>
    </form> );
}

export default Suataikhoannguoidung;