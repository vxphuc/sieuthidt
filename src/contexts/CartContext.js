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
    const handleCartChange = () => {
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cartData.length); // hoặc dùng reduce nếu muốn
    };
    fetchCartCount();

    // 🔄 Lắng nghe cả 2 loại sự kiện: storage (đa tab) và cart-updated (cùng tab)
    window.addEventListener("storage", handleCartChange);
    window.addEventListener("cart-updated", handleCartChange);

    // Gọi lần đầu
    handleCartChange();

    return () => {
      window.removeEventListener("storage", handleCartChange);
      window.removeEventListener("cart-updated", handleCartChange);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
