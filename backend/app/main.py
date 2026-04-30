from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.firebase import initialize_firebase, get_db
from app.api.auth import get_current_user
from pydantic import BaseModel
from firebase_admin import firestore
app = FastAPI(title=settings.app_name, version=settings.app_version)

initialize_firebase()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model dữ liệu để nhận từ Frontend
class NoteCreate(BaseModel):
    title: str
    content: str

@app.get("/")
async def root():
    return {"message": "Welcome to Quick Notes API"}

# 1. LẤY DANH SÁCH GHI CHÚ CỦA USER
@app.get("/api/v1/notes")
async def get_notes(current_user: dict = Depends(get_current_user)):
    db = get_db()
    notes_ref = db.collection("notes").where("user_id", "==", current_user["uid"])
    docs = notes_ref.stream()
    
    notes_list = []
    for doc in docs:
        note = doc.to_dict()
        note["id"] = doc.id
        notes_list.append(note)
    
    return notes_list

# 2. TẠO GHI CHÚ MỚI
@app.post("/api/v1/notes")
async def create_note(note: NoteCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    note_data = {
        "title": note.title,
        "content": note.content,
        "user_id": current_user["uid"],
        "created_at": firestore.SERVER_TIMESTAMP # Thời gian phía server
    }
    
    doc_ref = db.collection("notes").document()
    doc_ref.set(note_data)
    
    return {"id": doc_ref.id, "message": "Note created"}

# 3. XÓA GHI CHÚ
@app.delete("/api/v1/notes/{note_id}")
async def delete_note(note_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    note_ref = db.collection("notes").document(note_id)
    doc = note_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Kiểm tra xem ghi chú có phải của người đang đăng nhập không
    if doc.to_dict().get("user_id") != current_user["uid"]:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    note_ref.delete()
    return {"message": "Note deleted successfully"}

@app.get("/api/v1/users/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": current_user["uid"],
        "email": current_user["email"],
        "status": "Authenticated"
    }
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Quick Notes API"}

# Bổ sung vào main.py
@app.post("/api/v1/auth/login")
async def login(token: str):
    """
    Endpoint này nhận Firebase ID Token từ Frontend để xác thực thủ công 
    hoặc thiết lập session nếu cần.
    """
    try:
        from firebase_admin import auth
        # Kiểm tra token có hợp lệ không
        decoded_token = auth.verify_id_token(token)
        return {"status": "success", "uid": decoded_token['uid']}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")