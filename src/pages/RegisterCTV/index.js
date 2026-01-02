import React, { useState } from "react";

export default function RegisterCTV() {
	const [form, setForm] = useState({ name: "", email: "", phone: "" });
	const handleChange = e => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};
	const handleSubmit = e => {
		e.preventDefault();
		// simple validation
		if (!form.name || !form.email || !form.phone) {
			alert("Vui lòng nhập đầy đủ tên, email và số điện thoại.");
			return;
		}
		console.log("Submitted:", form);
		alert("Đã gửi dữ liệu! Kiểm tra console.");
		setForm({ name: "", email: "", phone: "" });
	};
	return (
		<div style={{ maxWidth: 480, margin: "24px auto", padding: 16 }}>
			<h2>Đăng ký CTV</h2>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: 12 }}>
					<label>Họ và tên</label>
					<input
						name="name"
						value={form.name}
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
					<label>Số điện thoại</label>
					<input
						name="phone"
						value={form.phone}
						onChange={handleChange}
						placeholder="0xxxxxxxxx"
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

