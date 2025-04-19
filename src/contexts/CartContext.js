import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Tạo context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Hàm lấy số lượng giỏ hàng từ server
  const fetchCartCount = async () => {
    try {
      const res = await axios.get("https://dtweb.onrender.com/cart", {
        withCredentials: true,
      });
      setCartCount(res.data.itemCount);
    } catch (err) {
      console.error("Lỗi lấy số lượng giỏ hàng:", err);
    }
  };

  useEffect(() => {
    fetchCartCount(); // Lấy lần đầu khi app khởi chạy
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
