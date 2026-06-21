import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./App.css";

function App() {
  const [orderNo, setOrderNo] = useState("");
  const [status, setStatus] = useState("กดปุ่มเริ่มสแกนเพื่อเปิดกล้องหลัง");
  const [scanner, setScanner] = useState(null);

  async function startScanner() {
    try {
      const html5QrCode = new Html5Qrcode("reader");

      await html5QrCode.start(
        { facingMode: "environment" }, // กล้องหลัง
        {
          fps: 10,
          qrbox: { width: 260, height: 180 }
        },
        (decodedText) => {
          setOrderNo(decodedText);
          setStatus(`สแกนสำเร็จ: ${decodedText}`);
          html5QrCode.stop();
        },
        () => {}
      );

      setScanner(html5QrCode);
      setStatus("กำลังสแกนด้วยกล้องหลัง...");
    } catch (error) {
      console.error(error);
      setStatus("เปิดกล้องไม่ได้ ตรวจสอบสิทธิ์กล้องหรือใช้ HTTPS");
    }
  }

  function checkOrder() {
    if (!orderNo.trim()) {
      setStatus("กรุณาสแกนหรือกรอกเลขคำสั่งซื้อ");
      return;
    }

    setStatus(`พร้อมค้นหาเลขคำสั่งซื้อ: ${orderNo}`);
  }

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, [scanner]);

  return (
    <div className="page">
      <div className="card">
        <h1>📦 Order Scanner</h1>
        <p className="subtitle">ระบบสแกนเลขคำสั่งซื้อผ่านมือถือ</p>

        <div className="cameraBox">
          <div id="reader"></div>
        </div>

        <button onClick={startScanner}>
          เปิดกล้องหลัง
        </button>

        <input
          type="text"
          placeholder="สแกนหรือกรอกเลขคำสั่งซื้อ"
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
        />

        <button onClick={checkOrder}>
          ค้นหาคำสั่งซื้อ
        </button>

        <div className="status">{status}</div>
      </div>
    </div>
  );
}

export default App;