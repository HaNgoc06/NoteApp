# NoteApp
Môn học: Tư duy tính toán  
Sinh viên thực hiện: Nguyễn Thị Ngọc Hà
MSSV: 24120299
Lớp: 24CTT3
  
**Hướng dẫn cài đặt và khởi chạy**
Bước 1: Cài đặt Backend
Di chuyển vào thư mục backend: cd backend.  
Tạo môi trường ảo: python -m venv venv.  
Kích hoạt môi trường ảo:
Windows: .\venv\Scripts\activate.  
Mac/Linux: source venv/bin/activate.  
Cài đặt thư viện: pip install -r requirements.txt. 
Chạy server: uvicorn app.main:app --reload.  

Bước 2: Chạy Frontend
Mở trực tiếp [http://127.0.0.1:5500/frontend/] bằng trình duyệt.
Hoặc sử dụng extension Live Server trong VS Code để chạy tại địa chỉ mặc định.