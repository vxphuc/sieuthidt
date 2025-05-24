export const updateCart = (updatedCart) => {
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  window.dispatchEvent(new Event("cart-updated")); // kích hoạt context cập nhật
};