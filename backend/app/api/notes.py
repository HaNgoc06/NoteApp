from app.core.firebase import get_db

def create_note(user_id: str, title: str, content: str):
    db = get_db()
    # Lưu vào collection 'notes', mỗi user có một bộ ghi chú riêng
    doc_ref = db.collection("users").document(user_id).collection("notes").document()
    doc_ref.set({
        "title": title,
        "content": content,
        "created_at": firestore.SERVER_TIMESTAMP
    })
    return {"id": doc_ref.id}