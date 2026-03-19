import React, { useState } from 'react';
import api from '../../../api/koc';
import styles from './CreateDiscount.module.css';

function CreateDiscount() {
    const [formData, setFormData] = useState({
        tensukien: '',
        giatrigiamgia: 20,
        is_koc: true, // ✅ boolean
        thoigianbatdau: '',
        thoigianketthuc: ''
    });

    const [status, setStatus] = useState({
        loading: false,
        message: '',
        error: false
    });

    // ✅ handle change chuẩn cho checkbox + input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // ✅ convert datetime-local → ISO chuẩn API
    const formatTimeForAPI = (timeString) => {
        if (!timeString) return "";
        return new Date(timeString).toISOString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setStatus({ loading: true, message: '', error: false });

        const payload = {
            tensukien: formData.tensukien,
            giatrigiamgia: Number(formData.giatrigiamgia),
            is_koc: formData.is_koc, // ✅ luôn true/false
            thoigianbatdau: formatTimeForAPI(formData.thoigianbatdau),
            thoigianketthuc: formatTimeForAPI(formData.thoigianketthuc)
        };

        console.log("Payload gửi lên:", payload); // debug

        try {
            const response = await api.post('/them-su-kien', payload);

            // ✅ API của bạn trả string "tạo thành công"
            if (response.data) {
                setStatus({
                    loading: false,
                    message: "Tạo sự kiện thành công",
                    error: false
                });

                // ✅ reset form
                setFormData({
                    tensukien: '',
                    giatrigiamgia: 20,
                    is_koc: true,
                    thoigianbatdau: '',
                    thoigianketthuc: ''
                });

            } else {
                setStatus({
                    loading: false,
                    message: 'Có lỗi xảy ra',
                    error: true
                });
            }

        } catch (error) {
            console.error("Lỗi:", error);

            setStatus({
                loading: false,
                message: error.response?.data || 'Lỗi server',
                error: true
            });
        }
    };

    return (
        <div className={styles.containerDiscount}>
            <div className={styles.cardDiscount}>
                <h2 className={styles.titleDiscount}>
                    Tạo Sự Kiện Giảm Giá Mới
                </h2>

                <form className={styles.formMainDiscount} onSubmit={handleSubmit}>

                    {/* Tên sự kiện */}
                    <div className={styles.formGroupDiscount}>
                        <label className={styles.labelDiscount}>Tên sự kiện</label>
                        <input
                            type="text"
                            name="tensukien"
                            className={styles.inputDiscount}
                            value={formData.tensukien}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Giá trị giảm giá */}
                    <div className={styles.formGroupDiscount}>
                        <label className={styles.labelDiscount}>Giảm giá (%)</label>
                        <input
                            type="number"
                            name="giatrigiamgia"
                            className={styles.inputDiscount}
                            value={formData.giatrigiamgia}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ✅ Checkbox KOC (BOOLEAN) */}
                    <div className={styles.checkboxGroupDiscount}>
                        <input
                            type="checkbox"
                            name="is_koc"
                            id="is_koc"
                            checked={formData.is_koc}
                            onChange={handleChange}
                        />
                        <label htmlFor="is_koc" className={styles.labelCheckboxDiscount}>
                            Chiến dịch KOC
                        </label>
                    </div>

                    {/* Thời gian */}
                    <div className={styles.dateRow}>
                        <div className={styles.dateCol}>
                            <label className={styles.labelDiscount}>Bắt đầu</label>
                            <input
                                type="datetime-local"
                                name="thoigianbatdau"
                                className={styles.inputDiscount}
                                value={formData.thoigianbatdau}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.dateCol}>
                            <label className={styles.labelDiscount}>Kết thúc</label>
                            <input
                                type="datetime-local"
                                name="thoigianketthuc"
                                className={styles.inputDiscount}
                                value={formData.thoigianketthuc}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={styles.buttonDiscount}
                        disabled={status.loading}
                    >
                        {status.loading ? 'Đang xử lý...' : 'Tạo Sự Kiện'}
                    </button>
                </form>

                {status.message && (
                    <div className={status.error ? styles.errorMsg : styles.successMsg}>
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateDiscount;