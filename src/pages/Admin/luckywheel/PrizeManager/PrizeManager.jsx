import { useEffect, useState } from "react";
import axios from "axios";
import "./PrizeManager.css";
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) ||
  "https://luckywheel-backend-acgn.onrender.com";

export default function PrizeManager({ prizes, setPrizes }) {
  const [label, setLabel] = useState("");
  const [image, setImage] = useState("");
  const [weight, setWeight] = useState(1);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editWeight, setEditWeight] = useState(1);
  const [editQuantity, setEditQuantity] = useState(0);

  // Tải danh sách (GET)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/prizes`);
        setPrizes(res.data || []);
      } catch (err) {
        console.error("❌ Error loading prizes:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setPrizes]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(res.data.url); // lưu url từ server
    } catch (err) {
      alert("Upload thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditImage(res.data.url); // lưu url mới khi edit
    } catch (err) {
      alert("Upload thất bại: " + (err.response?.data?.message || err.message));
    }
  };
  // Thêm và lưu ngay
  const addPrize = async () => {
    if (!label.trim()) return;
    const newPrizes = [...prizes, { label: label.trim(),image: image.trim(), weight: Number(weight) || 1,quantity: Number(quantity) || 0, }];
    setPrizes(newPrizes);
    setLabel("");
    setImage("");
    setWeight(1);
    setQuantity(0);

    try {
      await axios.post(`${API_BASE}/api/prizes`, newPrizes);
      console.log("✅ Đã lưu phần thưởng mới");
    } catch (e) {
      console.error("❌ Error saving prizes:", e.response?.data || e);
      alert("Lưu thất bại: " + (e.response?.data?.message || e.message));
    }
  };

  // Xóa và lưu ngay
  const removePrize = async (index) => {
    const newPrizes = prizes.filter((_, i) => i !== index);
    setPrizes(newPrizes);

    try {
      await axios.post(`${API_BASE}/api/prizes`, newPrizes);
      console.log("✅ Đã lưu sau khi xóa");
    } catch (e) {
      console.error("❌ Error saving prizes:", e.response?.data || e);
      alert("Lưu thất bại: " + (e.response?.data?.message || e.message));
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditLabel(prizes[index].label);
    setEditImage(prizes[index].image);
    setEditWeight(prizes[index].weight);
    setEditQuantity(prizes[index].quantity);
  };

  // Lưu sửa
  const saveEdit = async (index) => {
    const newPrizes = prizes.map((p, i) =>
      i === index ? { label: editLabel.trim(),image: editImage.trim(), weight: Number(editWeight) || 1, quantity: Number(editQuantity) || 0 } : p
    );
    setPrizes(newPrizes);
    setEditingIndex(null);
    try {
      await axios.post(`${API_BASE}/api/prizes`, newPrizes);
    } catch (e) {
      console.error("❌ Error saving prizes:", e.response?.data || e);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Đang tải danh sách…</p>;
  const totalWeight = prizes.reduce((sum, p) => sum + (p.weight || 0), 0);
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">🎁 Phần thưởng</h2>

      <div className="flex flex-col gap-2 mb-2">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Tên phần thưởng"
          className="border p-1"
        />
        <input type="file" onChange={handleUpload} className="border p-1" />
        {image && <img src={`${API_BASE}${image}`} style={{ width: "60px", height: "25px"}} alt="preview" className="w-16 h-16" />}
        <div className="flex gap-2">
          <input
            type="number"
            value={weight}
            min={1}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Tỷ lệ"
            className="border p-1 w-24"
          />
          <input
            type="number"
            value={quantity}
            min={0}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Số lượt"
            className="border p-1 w-24"
          />
        </div>
        <button onClick={addPrize} className="px-3 py-1 bg-blue-600 text-white rounded">
          ➕ Thêm
        </button>
      </div>

      {/* Danh sách */}
      <ul className="menuwheel max-h-80 overflow-auto pr-1" >
        {prizes.map((p, i) => (
          
          <li key={`${p.label}-${i}`} className="flex justify-between items-center mb-1 bg-gray-50 px-2 py-1 rounded">
            {editingIndex === i ? (
              <div className="menuwheel1 flex space-x-2 flex-1">
                <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} className="border p-1 flex-1" />
                <input type="file" onChange={handleEditUpload} className="border p-1" />
                {editImage && (
                  <img
                    src={`${API_BASE}${editImage}`}
                    style={{ width: "60px", height: "25px" }}
                    alt="preview"
                  />
                )}
                <input type="number" value={editWeight} min={1} onChange={(e) => setEditWeight(e.target.value)} className="border p-1 w-20" />
                <input type="number" value={editQuantity} min={0} onChange={(e) => setEditQuantity(e.target.value)} className="border p-1 w-20" />
                <button onClick={() => saveEdit(i)} className="px-2 bg-green-500 text-white rounded">💾 Lưu</button>
                <button onClick={() => setEditingIndex(null)} className="px-2 bg-gray-400 text-white rounded">Hủy</button>
              </div>
            ) : (
              <>
                {p.image && <img src={`${API_BASE}${p.image}`} style={{ width: "60px", height: "25px"}} className="w-10 h-10 object-cover" alt={p.label} />}
                <span>{p.label} <span className="text-gray-500">(x{p.weight}, còn {p.quantity})
                  <strong>{totalWeight > 0 ? ((p.weight / totalWeight) * 100).toFixed(2) : 0}%</strong>
                </span></span>
                <div className="space-x-2">
                  <button onClick={() => startEdit(i)} className="text-blue-500 hover:underline">Sửa</button>
                  <button onClick={() => removePrize(i)} className="text-red-500 hover:underline">Xóa</button>
                </div>
              </>
            )}
          </li>
        ))}
        {prizes.length === 0 && (
          <li className="text-sm text-gray-500">Chưa có phần thưởng nào.</li>
        )}
      </ul>
    </div>
  );
}
