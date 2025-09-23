import { useState, useEffect } from "react";
import axios from "axios";
import LuckyWheel from "./LuckyWheel";
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE) ||
  "https://luckywheel-backend-acgn.onrender.com";
function LuckyWheelPage() {
  const [prizes, setPrizes] = useState([]);
  const [settings, setSettings] = useState({ duration: 4000, randomColors: false });

  const reloadPrizes = async () => {
    const res = await axios.get(`${API_BASE}/api/prizes`);
    setPrizes(res.data || []);
  };

  useEffect(() => { reloadPrizes(); }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <LuckyWheel
        prizes={prizes}
        settings={settings}
        setPrizes={setPrizes}
        onStockChanged={reloadPrizes}
      />
    </div>
  );
}

export default LuckyWheelPage;