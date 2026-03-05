import { useState } from "react";
import styles from "./registerDistributor.module.css";
function RegisterDistributor() {
    const [tendaily, setTendaily] = useState("");
    const [tinh, setTinh] = useState("");
    const [xa, setXa] = useState("");
    const [diachicuthe, setDiachicuthe] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('https://staging.chatapi.io.vn/dang-ky-dai-ly',{
                method: 'POST',
                headers:{
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    tendaily: tendaily,
                    tinh: tinh,
                    xa: xa,
                    diachicuthe: diachicuthe
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Đăng ký thành công!");
                setTendaily("");
                setTinh("");
                setXa("");
                setDiachicuthe("");
            }else {
                setMessage("Đăng ký thất bại. Vui lòng thử lại.");
            }
        }catch (error) {
            setMessage("Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.title}>Đăng ký đại lý</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="tendaily">Tên đại lý:</label>
                        <input
                            id="tendaily"
                            type="text"
                            value={tendaily}
                            onChange={(e) => setTendaily(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Nhập tên đại lý"
                            onFocus={(e) => e.target.placeholder = ""}
                            onBlur={(e) => e.target.placeholder = "Nhập tên đại lý"}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="tinh">Tỉnh/Thành phố:</label>
                        <input
                            id="tinh"
                            type="text"
                            value={tinh}
                            onChange={(e) => setTinh(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Nhập tỉnh/thành phố"
                            onFocus={(e) => e.target.placeholder = ""}
                            onBlur={(e) => e.target.placeholder = "Nhập tỉnh/thành phố"}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="xa">Xã/Phường:</label>
                        <input
                            id="xa"
                            type="text"
                            value={xa}
                            onChange={(e) => setXa(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Nhập xã/phường"
                            onFocus={(e) => e.target.placeholder = ""}
                            onBlur={(e) => e.target.placeholder = "Nhập xã/phường"}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="diachicuthe">Địa chỉ cụ thể:</label>
                        <input
                            id="diachicuthe"
                            type="text"
                            value={diachicuthe}
                            onChange={(e) => setDiachicuthe(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Nhập địa chỉ cụ thể"
                            onFocus={(e) => e.target.placeholder = ""}
                            onBlur={(e) => e.target.placeholder = "Nhập địa chỉ cụ thể"}
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                        {isLoading ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                </form>
            </div>
        </div>
    )
}
export default RegisterDistributor;