import React, { useState } from "react";
import "./RegisterCTV.module.css";
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
			const message = err?.response?.data || err.message || 'Không thể gửi yêu cầu. Kiểm tra kết nối.';
			alert(message);
		}
	};

	return (
		<div style={{ maxWidth: 480, margin: "24px auto", padding: 16 }}>
			<h2>Đăng ký CTV</h2>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: 12 }}>
					<label>Họ và tên</label>
					<input
						name="hoten"
						value={form.hoten}
						onChange={handleChange}
						placeholder="Nhập tên"
						style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
					/>
				</div>
				<div style={{ marginBottom: 12 }}>
					<label>Gmail</label>
					<input
						name="email"
						type="email"
						value={form.email}
						onChange={handleChange}
						placeholder="example@gmail.com"
						style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
					/>
				</div>
				<div style={{ marginBottom: 12 }}>
					<label>Địa chỉ</label>
					<input
						name="diachi"
						value={form.diachi}
						onChange={handleChange}
						placeholder="Nhập địa chỉ"
						style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
					/>
				</div>
				<button type="submit" style={{ padding: "8px 16px" }}>
					Gửi
				</button>
			</form>
		</div>
	);
}

