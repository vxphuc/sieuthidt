import React, { useState, useEffect, useCallback } from "react";
import styles from "./RegisterCTV.module.css";
import koc from "../../api/koc";

import RegisterForm from "./RegisterForm";
import KOCDashboard from "./KOCDashboard";

export default function RegisterCTV() {
    const [view, setView] = useState('loading');
    const [statusDashboard, setStatusDashboard] = useState('pending');
    const [events, setEvents] = useState([]);
    
    // --- CẤU HÌNH PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT = 5;

    const checkKOCStatus = useCallback(async () => {
        try {
            // Truyền tham số page và limit động
            const res = await koc.get('/su-kien-danh-cho-koc', {
                params: { 
                    page: currentPage, 
                    limit: LIMIT 
                } 
            });
            
            if (res.status === 200 && res.data) {
                const eventList = res.data.detail || [];
                setEvents(Array.isArray(eventList) ? eventList : []);
                setStatusDashboard('approved');
                setView('dashboard');
                
                localStorage.removeItem('koc_pending'); 
            }

        } catch (err) {
            console.log("Lỗi hoặc chưa phải KOC:", err);
            
            const isPending = localStorage.getItem('koc_pending');
            if (isPending) {
                setStatusDashboard('pending');
                setView('dashboard');
            } else {
                setView('register');
            }
        }
    }, [currentPage]);

    const handleCreateCode = async (eventId) => {
        if (!window.confirm("Bạn có chắc chắn muốn tạo mã giảm giá cho sự kiện này?")) {
            return;
        }

        try {
            const res = await koc.post('/tao-ma-giam-gia-KOC', { 
                id_sukien: eventId 
            });

            if (res.status === 200 || res.status === 201) {
                alert(res.data.detail || "Tạo mã giảm giá thành công!");
            }
        } catch (err) {
            console.error("Lỗi tạo mã:", err);
            const msg = err.response?.data?.detail || "Tạo mã thất bại. Vui lòng thử lại.";
            alert(msg);
        }
    };

    useEffect(() => {
        checkKOCStatus();
    }, [checkKOCStatus]);

    const handleRegisterSuccess = () => {
        alert("Gửi đăng ký thành công! Vui lòng chờ Admin duyệt.");
        localStorage.setItem('koc_pending', 'true');
        setStatusDashboard('pending');
        setView('dashboard');
    };

    const handleReset = () => {
        localStorage.removeItem('koc_pending');
        setView('register');
    };

    // Hàm chuyển trang
    const handleNextPage = () => setCurrentPage(prev => prev + 1);
    const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));

    if (view === 'loading') {
        return <div className={styles.container} style={{textAlign: 'center', padding: 20}}>Đang tải dữ liệu...</div>;
    }

    if (view === 'register') {
        return <RegisterForm onSuccess={handleRegisterSuccess} />;
    }

    if (view === 'dashboard') {
        const hasMore = events.length === LIMIT;

        return (
            <KOCDashboard 
                status={statusDashboard} 
                events={events}
                onRetry={checkKOCStatus}
                onReset={handleReset}
                
                // Phân trang
                currentPage={currentPage}
                onNext={handleNextPage}
                onPrev={handlePrevPage}
                hasMore={hasMore}

                onCreateCode={handleCreateCode}
            />
        );
    }
    
    return null;
}