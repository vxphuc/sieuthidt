import { useState, useEffect } from "react";
import axios from "axios";
import LuckyWheel from "./LuckyWheel/LuckyWheel";
import WheelControl from "./WheelControl/WheelControl";
import "./style.css";
function index() {
  const [prizes, setPrizes] = useState([]);
  const [settings, setSettings] = useState({ duration: 4000, randomColors: false });

  const reloadPrizes = async () => {
    const res = await axios.get(`${API_BASE}/api/prizes`);
    setPrizes(res.data || []);
  };

  useEffect(() => { reloadPrizes(); }, []);

  return (
    <div className="containerwheel">
      <div className="control">
        <WheelControl
          prizes={prizes}
          setPrizes={setPrizes}
          settings={settings}
          setSettings={setSettings}
        />
      </div>
      <div className="wheel">
        <LuckyWheel
          prizes={prizes}
          settings={settings}
          setPrizes={setPrizes}
          onStockChanged={reloadPrizes}
        />
      </div>
    </div>
  );
}

export default index;