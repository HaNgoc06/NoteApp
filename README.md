# NoteApp
- Sinh viên: Nguyễn Thị Ngọc Hà
- MSSV: 24120299
- Lớp: 24CTT3

## Cài đặt Environment

### Yêu cầu
- Python 3.10+
- Tài khoản Firebase (đã tạo project)

### Bước 1: Clone repository

```bash
git clone https://github.com/HaNgoc06/NoteApp.git
cd NoteApp
```

### Bước 2: Tạo môi trường ảo và cài đặt dependencies

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### Bước 3: Cấu hình Firebase cho Frontend
Để Frontend có thể kết nối với Firebase, lấy thông tin cấu hình từ Firebase Console và dán vào file `frontend/app.js`.

1. Truy cập [Firebase Console](https://console.firebase.google.com/).
2. Chọn project  (hoặc tạo mới).
3. Tại giao diện **Project Overview**, nhấn vào biểu tượng **Web** (</>) để đăng ký ứng dụng.
4. Sau khi đăng ký, Firebase sẽ cung cấp đoạn mã `firebaseConfig`.
5. Copy các thông số đó và dán vào file `frontend/app.js`:
```javascript
// frontend/app.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```
### Bước 4: Cấu hình Firebase
1. Vào [Firebase Console](https://console.firebase.google.com/), tạo project mới (hoặc dùng project có sẵn).
2. Bật **Authentication** → chọn provider **Email/Password** và **Google**.
3. Tạo **Firestore Database** ở chế độ test.
4. Vào **Project Settings → Service Accounts** → Generate new private key → lưu file thành `firebase_service_account.json` ở thư mục gốc project.
5. Tạo file `backend/.env` với nội dung:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
FRONTEND_URL=http://127.0.0.1:5500/frontend/index.html
```

## Chạy Backend

```bash
cd backend
uvicorn main:app --reload
```

Backend chạy tại: **http://localhost:8000**

## Chạy Frontend

Mở file `frontend/index.html` bằng **Live Server** (extension trong VS Code):

1. Cài extension **Live Server** trong VS Code.
2. Chuột phải vào `frontend/index.html` → **Open with Live Server**.
3. Trình duyệt sẽ tự mở tại `http://127.0.0.1:5500`.

> Hoặc mở trực tiếp file `index.html` trong trình duyệt.

## 🎬 Video Demo
https://github.com/user-attachments/assets/985277e8-269a-49dc-9af1-72d7836d4916
