import React, { useState } from 'react';
import api from '../../../api/koc';
import styles from './CreateDiscount.module.css';

function CreateDiscount() {
    const [formData, setFormData] = useState({
        tensukien: '',
        giatrigiamgia: 25,
        is_koc: true,
        thoigianbatdau: '',
        thoigianketthuc: ''
    });

    const [status, setStatus] = useState({ loading: false, message: '', error: false });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const formatTimeForAPI = (timeString) => {
        if (!timeString) return "";
        return `${timeString}:00+07:00`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', error: false });
        const payload = {
            ...formData,
            giatrigiamgia: Number(formData.giatrigiamgia),
            thoigianbatdau: formatTimeForAPI(formData.thoigianbatdau),
            thoigianketthuc: formatTimeForAPI(formData.thoigianketthuc)
        };

        try {
            const response = await api.post('/them-su-kien', payload);
            if (response.data && response.data.status_code === 201) {
                setStatus({ 
                    loading: false, 
                    message: `Thành công: ${response.data.detail}`, 
                    error: false 
                });
            } else {
                setStatus({ 
                    loading: false, 
                    message: 'Có lỗi xảy ra', 
                    error: true 
                });
            }
        } catch (error) {
            console.error("Lỗi tạo mã:", error);
            setStatus({ 
                loading: false, 
                message: error.response?.data?.detail || 'Lỗi kết nối server', 
                error: true 
            });
        }
    };
    return (
        <div className={styles.containerDiscount}>
            <div className={styles.cardDiscount}>
                <h2 className={styles.titleDiscount}>Tạo Sự Kiện Giảm Giá Mới</h2>
                
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
                            placeholder="Ví dụ: Sale Tết 2026"
                            required
                        />
                    </div>

                    {/* Giá trị giảm giá */}
                    <div className={styles.formGroupDiscount}>
                        <label className={styles.labelDiscount}>Giá trị giảm giá (%)</label>
                        <input
                            type="number"
                            name="giatrigiamgia"
                            className={styles.inputDiscount}
                            value={formData.giatrigiamgia}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Checkbox KOC */}
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

                    <div className={styles.dateRow}>
                        {/* Thời gian bắt đầu */}
                        <div className={styles.dateCol}>
                            <label className={styles.labelDiscount}>Thời gian bắt đầu</label>
                            <input
                                type="datetime-local"
                                name="thoigianbatdau"
                                className={styles.inputDiscount}
                                value={formData.thoigianbatdau}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Thời gian kết thúc */}
                        <div className={styles.dateCol}>
                            <label className={styles.labelDiscount}>Thời gian kết thúc</label>
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
                    {/* Nút Submit */}
                    <button 
                        type="submit" 
                        className={styles.buttonDiscount}
                        disabled={status.loading}
                    >
                        {status.loading ? 'Đang xử lý...' : 'Tạo Sự Kiện'}
                    </button>
                </form>
                {/* Thông báo trạng thái */}
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