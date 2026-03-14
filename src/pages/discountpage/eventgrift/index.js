import React, { useEffect, useState } from 'react';
import styles from './eventGrift.module.css';
import { useNavigate } from 'react-router-dom';
import { useRef } from "react";

const eventgrift = () => {
  const [quantity, setQuantity] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [maDinhDanh, setMaDinhDanh] = useState('');
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [dsLo, setDsLo] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showLimitForm, setShowLimitForm] = useState(false);
  const [selectedLoId, setSelectedLoId] = useState("");
  const [limitValue, setLimitValue] = useState("");
  const [showLimitDropdown, setShowLimitDropdown] = useState(false);
  const limitDropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (limitDropdownRef.current && !limitDropdownRef.current.contains(event.target)) {
        setShowLimitDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLimitLo = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/dang-nhap", { state: { from: "/quan-tri/tao-ma-giam-gia-hang-loat" } });
      return;
    }

    if (!selectedLoId) {
      alert("Vui lòng chọn lô!");
      return;
    }

    if (!limitValue || limitValue <= 0) {
      alert("Vui lòng nhập limit hợp lệ!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        "https://chatapi.io.vn/gan-ma-hang-loat-vao-lo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idlophieu: selectedLoId,
            limit: Number(limitValue),
          }),
        }
      );

      const data = await res.json();
      if (data?.detail === "Could not validate credentials" || data?.detail === 404) {
            localStorage.removeItem('authToken');
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            navigate('/dang-nhap', { state: { from: "/quan-tri/tao-ma-giam-gia-hang-loat" } });
            return;
        }
      if (res.ok) {
        alert("Giới hạn mã thành công!");
        setLimitValue("");
        setSelectedLoId("");
        setShowLimitForm(false);
      } else {
        alert(data?.detail || "Có lỗi xảy ra!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchDsLo = async () => {
    try {
      const res = await fetch('https://chatapi.io.vn/ds-lo-phieu?page=1');
      
      const data = await res.json();
      if (res.ok) {
        setDsLo(data);
      }
    } catch (err) {
      console.error("Lỗi load danh sách lô");
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/dang-nhap', {state: { from: "/quan-tri/tao-ma-giam-gia-hang-loat" }});
    }
  }, [navigate]);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/dang-nhap', {state: { from: "/quan-tri/tao-ma-giam-gia-hang-loat" }});
      return;
    }
    if(!maDinhDanh.trim()){
      alert("Vui lòng nhập mã định danh lô!");
      return;
    }
    setIsLoading(true);
    try{
      const response = await fetch(`https://chatapi.io.vn/tao-lo-phieu?madinhdanh=${maDinhDanh}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data?.detail === "Could not validate credentials" || data?.detail === 404) {
        localStorage.removeItem('authToken');
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        navigate('/dang-nhap', {state: { from: "/quan-tri/tao-ma-giam-gia-hang-loat" }});
        return;
      }
      if (response.ok) {
        alert(`Tạo lô mã "${maDinhDanh}" thành công!`);
        setMaDinhDanh('');
      } else {
        alert(data?.detail || "Có lỗi xảy ra khi tạo lô mã.");
      }
    }catch(error){
      console.error("Lỗi kết nối:", error);
      alert("Lỗi kết nối đến máy chủ.");
    }
    finally{
      setIsLoading(false);
    }
  }

  const handleCreateCodes = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
        navigate('/dang-nhap', {state: { from: "/quan-tri/tao-ma-giam-gia-hang-loat" }});
        return;
    }
    if (quantity <= 0) {
      alert("Vui lòng nhập số lượng lớn hơn 0");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://chatapi.io.vn/tao-ma-hang-loat?soluong=${quantity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data?.detail === "Could not validate credentials" || data?.detail === 404) {
            localStorage.removeItem('authToken');
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            navigate('/dang-nhap', {state: { from: "/quan-tri/tao-ma-giam-gia-hang-loat" }});
            return;
        }
      if (response.ok) {
        alert(`Đã gửi yêu cầu tạo ${quantity} mã thành công!`);
      } else {
        alert("Có lỗi xảy ra khi tạo mã.");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Lỗi kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/dang-nhap', {state: { from: "/quan-tri/tao-ma-giam-gia-hang-loat" }});
      return;
    }

    if (!maDinhDanh.trim()) {
      alert("Vui lòng nhập mã định danh!");
      return;
    }

    if (!quantity || quantity <= 0) {
      alert("Vui lòng nhập số lượng hợp lệ!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://chatapi.io.vn/tao-ma-va-gan-vao-lo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            madinhdanh: maDinhDanh,
            soluong: Number(quantity),
          }),
        }
      );

      const data = await response.json();
      if (data?.detail === "Could not validate credentials" || data?.detail === 404) {
            localStorage.removeItem('authToken');
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            navigate('/dang-nhap', {state: { from: "/quan-tri/tao-ma-giam-gia-hang-loat" }});
            return;
        }
      if (response.ok) {
        alert("Tạo mã thành công!");
        setShowPopup(false);
        setMaDinhDanh("");
        setQuantity("");
      } else {
        alert(data?.detail || "Có lỗi xảy ra!");
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>Tạo Mã Giảm Giá Hàng Loạt</h2>
        <hr className={styles.divider} />
        <button
          type="button"
          className={styles.batchToggleBtn}
          onClick={() => setShowBatchForm(!showBatchForm)}
        >
          {showBatchForm ? '− Đóng ▲' : '+ Tạo lô ▼'}
        </button>
        <div className={`${styles.batchWrapper} ${showBatchForm ? styles.open : ''}`}>
        <form onSubmit={handleCreateBatch}>
          <div className={styles.formGroup}>
            <h5>Mã định danh lô:</h5>
            <input
              id="maDinhDanh"
              type="text"
              value={maDinhDanh}
              onChange={(e) => setMaDinhDanh(e.target.value)}
              placeholder="Ví dụ: lomaA"
              className={styles.inputNumber}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận tạo lô'}
          </button>
        </form>
      </div>

        <button
          className={styles.batchToggleBtn}
          onClick={() => setShowPopup(!showPopup)}
        >
          {showPopup ? "− Đóng ▲" : "+ Tạo mã & lô ▼"}
        </button>

        <div className={`${styles.codeWrapper} ${showPopup ? styles.open : ""}`}>
          <form onSubmit={handleCreate}>
            <h5>Tạo mã & Gán vào lô</h5>
            <div className={styles.formGroup}>
              <div className={styles.dropdownWrapper} ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Mã định danh"
                  value={maDinhDanh}
                  onChange={(e) => setMaDinhDanh(e.target.value)}
                  className={styles.inputNumber}
                  onFocus={() => {
                    setShowDropdown(true);
                    fetchDsLo();
                  }}
                />
                <button
                  type="button"
                  className={styles.dropdownBtn}
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    if (!showDropdown) fetchDsLo();
                  }}
                >
                  ▼
                </button>
                {showDropdown && (
                  <div className={styles.dropdownList}>
                    {dsLo.map((item) => (
                      <div
                        key={item.id}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setMaDinhDanh(item.madinhdanh);
                          setShowDropdown(false);
                        }}
                      >
                        {item.madinhdanh}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <input
                type="number"
                placeholder="Nhập số lượng"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={styles.inputNumber}
                onFocus={(e) => e.target.placeholder = ''}
                onBlur={(e) => e.target.placeholder = 'Nhập số lượng'}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </form>
        </div>

        <button
          className={styles.batchToggleBtn}
          onClick={() => setShowBulkForm(!showBulkForm)}
        >
          {showBulkForm ? "− Đóng ▲" : "+ Tạo mã ▼"}
        </button>
        <div className={`${styles.codeWrapper} ${showBulkForm ? styles.open : ""}`}>
          <form onSubmit={handleCreateCodes}>
            <h5>Số lượng mã muốn tạo</h5>

            <div className={styles.formGroup}>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Nhập số lượng"
                className={styles.inputNumber}
                onFocus={(e) => e.target.placeholder = ''}
                onBlur={(e) => e.target.placeholder = 'Nhập số lượng'}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận tạo mã"}
            </button>
          </form>
        </div>

        <button
  className={styles.batchToggleBtn}
  onClick={() => {
    setShowLimitForm(!showLimitForm);
    if (!showLimitForm) fetchDsLo();
  }}
>
  {showLimitForm ? "− Đóng ▲" : "+ Giới hạn mã của lô ▼"}
</button>

<div className={`${styles.codeWrapper} ${showLimitForm ? styles.open : ""}`}>
  <form onSubmit={handleLimitLo}>
    <h5>Giới hạn số mã của lô</h5>

    <div className={styles.formGroup}>
      <div className={styles.dropdownWrapper} ref={limitDropdownRef}>
        <input
          type="text"
          placeholder="Chọn lô"
          value={
            dsLo.find((lo) => lo.id === selectedLoId)?.madinhdanh || ""
          }
          readOnly
          className={styles.inputNumber}
          onClick={() => {
            setShowLimitDropdown(!showLimitDropdown);
            if (!showLimitDropdown) fetchDsLo();
          }}
        />

        <button
          type="button"
          className={styles.dropdownBtn}
          onClick={() => {
            setShowLimitDropdown(!showLimitDropdown);
            if (!showLimitDropdown) fetchDsLo();
          }}
        >
          ▼
        </button>

        {showLimitDropdown && (
          <div className={styles.dropdownList}>
            {dsLo.map((item) => (
              <div
                key={item.id}
                className={styles.dropdownItem}
                onClick={() => {
                  setSelectedLoId(item.id);
                  setShowLimitDropdown(false);
                }}
              >
                {item.madinhdanh}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className={styles.formGroup}>
      <input
        type="number"
        placeholder="Nhập limit"
        value={limitValue}
        onChange={(e) => setLimitValue(e.target.value)}
        className={styles.inputNumber}
      />
    </div>

    <button
      type="submit"
      className={styles.submitBtn}
      disabled={isLoading}
    >
      {isLoading ? "Đang xử lý..." : "Xác nhận giới hạn"}
    </button>
  </form>
</div>
      </div>
    </div>
  );
};

export default eventgrift;