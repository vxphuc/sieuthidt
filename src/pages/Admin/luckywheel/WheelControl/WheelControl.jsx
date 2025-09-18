import { useState } from "react";
import PrizeManager from "../PrizeManager/PrizeManager";
import GeneralSettings from "../GeneralSettings/GeneralSettings";
import SpinViewer from "../SpinViewer/SpinViewer";
import "./WheelControl.css";
import SpinLimitControl from "../SpinLimitControl/SpinLimitControl";
function WheelControl({ prizes, setPrizes, settings, setSettings }) {
  const [activeTab, setActiveTab] = useState("prizes");

  return (
    <div className="wheel-control">
      {/* Bên trái: Tabbar */}
      <div className="tabbar">
        <h3>Cấu hình vòng quay</h3>
        <button
          onClick={() => setActiveTab("prizes")}
          className={activeTab === "prizes" ? "active" : ""}
        >
          🎁 Chỉnh sửa quà
        </button>
        <button
          onClick={() => setActiveTab("limit")}
          className={activeTab === "limit" ? "active" : ""}
        >
          🎯 Lượt quay
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={activeTab === "settings" ? "active" : ""}
        >
          ⚙️ Cài đặt chung
        </button>
        <button
          onClick={() => setActiveTab("spins")}
          className={activeTab === "spins" ? "active" : ""}
        >
          📜 Xem trúng giải
        </button>
      </div>

      {/* Bên phải: Nội dung tab */}
      <div className="tab-content">
        {activeTab === "prizes" && (
          <PrizeManager prizes={prizes} setPrizes={setPrizes} />
        )}
        {activeTab === "limit" && <SpinLimitControl />}
        {activeTab === "settings" && (
          <GeneralSettings settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "spins" && <SpinViewer />}
      </div>
    </div>
  );
}


export default WheelControl;
