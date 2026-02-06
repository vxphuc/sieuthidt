import React, {useState} from "react";
import styles from './attachCode.module.css';

const attachcodeevent = () => {
    const [eventId, setEventId] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAttachCode = async (e) => {
        e.preventDefault();

        if (!eventId) {
            alert("Vui lòng nhập lại ID sự kiện");
            return;
        }
        if(code <= 0){
            alert("Vui lòng nhập số lượng mã lớn hơn 0");
            return;
        }
        setIsLoading(true);
        try{
            const response = await fetch(`https://chatapi.io.vn/gan-ma-tuong-ung-vao-sukien?soluong=${code}&id_sukien=${eventId}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if(response.ok){
                alert(`Đã gửi yêu cầu gán ${code} mã vào sự kiện thành công!`);
            }else{
                alert("Có lỗi xảy ra khi gán mã vào sự kiện.");
            }
        }catch(error){
            console.error("Lỗi kết nối:", error);
            alert("Lỗi kết nối đến máy chủ.");
        }finally{
            setIsLoading(false);
        }
    };
    return(
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.title}>Gán mã vào sự kiện</h2>
                <form onSubmit={handleAttachCode}>
                    <div className={styles.formGroup}>
                        <label htmlFor="eventId">Nhập ID sự kiện:</label>
                        <input
                            id="eventId"
                            type="text"
                            value={eventId}
                            onChange={(e) => setEventId(e.target.value)}
                            placeholder="Nhập ID sự kiện"
                            className={styles.inputNumber}
                        />
                        
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="code">Số lượng mã muốn gán vào sự kiện:</label>
                        <input
                            id="code"
                            type="number"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Nhập số lượng mã"
                            className={styles.inputNumber}
                        />
                    </div>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}

                    >
                        {isLoading ? 'Đang xử lý...' : 'Gán mã vào sự kiện'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default attachcodeevent;