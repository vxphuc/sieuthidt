import React, { useState } from "react";
import styles from "./RegisterCTV.module.css";
import koc from "../../api/koc";


export default function RegisterCTV() {
	const [form, setForm] = useState({ hoten: "", email: "", diachi: "" });

	const handleChange = e => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!form.hoten || !form.email || !form.diachi) {
			alert("Vui lòng nhập đầy đủ tên, gmail và địa chỉ.");
			return;
		}
		try {
			const payload = { hoten: form.hoten, email: form.email, diachi: form.diachi };
			const res = await koc.post('/dang-ky-koc', payload);
			alert('Đã gửi đăng ký. Vui lòng đợi admin duyệt.');
			setForm({ hoten: "", email: "", diachi: "" });
		} catch (err) {
			console.error('Submit failed', err);
			try {
				if (err && typeof err.toJSON === 'function') console.error('Axios error.toJSON():', err.toJSON());
			} catch (e) {
				console.error('toJSON log failed', e);
			}
			const serverData = err?.response?.data;
			const message = serverData?.message || (typeof serverData === 'string' ? serverData : JSON.stringify(serverData || {})) || err.message || 'Không thể gửi yêu cầu. Kiểm tra kết nối.';
			alert(message);
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.heading}>Đăng ký CTV</h2>
			<div className={styles.headingContent}>Đăng kí để trở thành CTV của chúng tôi</div>
			<div className={styles.formBox}>
				<form onSubmit={handleSubmit}>
					<div className={styles.formRow}>
						<label className={styles.label}>Họ và tên</label>
						<input
							className={styles.input}
							name="hoten"
							value={form.hoten}
							onChange={handleChange}
							placeholder="Nhập tên"
						/>
					</div>

					<div className={styles.formRow}>
						<label className={styles.label}>Gmail</label>
						<input
							className={styles.input}
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							placeholder="example@gmail.com"
						/>
					</div>

					<div className={styles.formRow}>
						<label className={styles.label}>Địa chỉ</label>
						<input
							className={styles.input}
							name="diachi"
							value={form.diachi}
							onChange={handleChange}
							placeholder="Nhập địa chỉ"
						/>
					</div>

					<div className={styles.actions}>
						<button type="submit" className={styles.submitBtn}>
							Đăng ký CTV
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

