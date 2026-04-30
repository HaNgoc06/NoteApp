// --- 1. Cấu hình Firebase ---
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Biến toàn cục quản lý dữ liệu
let notes = [];
let editingNoteId = null;

// --- 2. Quản lý trạng thái người dùng ---
auth.onAuthStateChanged(async (user) => {
    const authSection = document.getElementById('authSection');
    
    if (user) {
        // Thay đổi UI thành Avatar khi đã đăng nhập
        const photoURL = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`;
        authSection.innerHTML = `
            <div class="user-profile">
                <img src="${photoURL}" class="user-avatar" alt="User">
                <div class="profile-dropdown">
                    <button class="dropdown-item" onclick="handleSignOut()">Sign Out</button>
                </div>
            </div>
        `;
        // Tải ghi chú từ Firestore
        await loadUserNotes();
    } else {
        // Quay về nút Login/Signup khi chưa đăng nhập
        authSection.innerHTML = `
            <button class="add-note-btn" onclick="document.getElementById('loginDialog').showModal()">Login</button>
            <button class="add-note-btn" onclick="document.getElementById('signupDialog').showModal()">Sign Up</button>
        `;
        notes = []; 
        renderNotes();
    }
});

// --- 3. API Backend ---

// Lấy danh sách ghi chú
async function loadUserNotes() {
    try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        const response = await fetch('http://localhost:8000/api/v1/notes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        notes = await response.json();
        renderNotes();
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

// Lưu/Cập nhật ghi chú
async function saveNote(event) {
    event.preventDefault();
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    const user = auth.currentUser;

    if (!user) {
        alert("Please login to save notes!");
        return;
    }

    const token = await user.getIdToken();

    try {
        if (editingNoteId) {
            alert("Update feature coming soon or use create new!");
        } else {
            // Tạo mới ghi chú qua API
            const response = await fetch('http://localhost:8000/api/v1/notes', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                await loadUserNotes(); // Tải lại danh sách sau khi thêm
            }
        }
        closeNoteDialog();
    } catch (error) {
        console.error("Save note error:", error);
    }
}

// Xóa ghi chú
async function deleteNote(id) {
    const user = auth.currentUser;
    if (!user) return;
    
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
        const token = await user.getIdToken();
        const response = await fetch(`http://localhost:8000/api/v1/notes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            notes = notes.filter(n => n.id !== id);
            renderNotes();
        }
    } catch (error) {
        console.error("Delete error:", error);
    }
}

// --- 4. Logic hiển thị ---

function renderNotes() {
    const container = document.getElementById('notesContainer');
    if (notes.length === 0) {
        container.innerHTML = `<div class="empty-state"><h2>No notes yet</h2><button class="add-note-btn" onclick="openNoteDialog()">+ Add First Note</button></div>`;
        return;
    }
    container.innerHTML = notes.map(note => `
        <div class="note-card">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>
            <div class="note-actions">
                <button class="edit-btn" onclick="openNoteDialog('${note.id}')">✎</button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')">✖</button>
            </div>
        </div>`).join('');
}

function openNoteDialog(id = null) {
    editingNoteId = id;
    const note = notes.find(n => n.id === id);
    document.getElementById('dialogTitle').textContent = id ? 'Edit Note' : 'Add New Note';
    document.getElementById('noteTitle').value = id ? note.title : '';
    document.getElementById('noteContent').value = id ? note.content : '';
    document.getElementById('noteDialog').showModal();
}

function closeNoteDialog() { document.getElementById('noteDialog').close(); }

// --- 5. Logic xác thực ---

async function handleGoogleLogin() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        document.getElementById('loginDialog').close();
        document.getElementById('signupDialog').close();
    } catch (error) {
        alert("Login failed: " + error.message);
    }
}

async function handleSignOut() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Sign out error", error);
    }
}

function openLoginFromSignup() {
    document.getElementById('signupDialog').close();
    document.getElementById('loginDialog').showModal();
}

function openSignupFromLogin() {
    document.getElementById('loginDialog').close();
    document.getElementById('signupDialog').showModal();
}

// --- 6. Khởi tạo khi tải trang ---
document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();

    document.getElementById('noteForm').addEventListener('submit', saveNote);
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

    // Login Form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        try {
            await auth.signInWithEmailAndPassword(email, pass);
            document.getElementById('loginDialog').close();
        } catch (error) {
            alert("Invalid email or password.");
        }
    });

    // Signup Form
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const pass = document.getElementById('signup-password').value;
        try {
            await auth.createUserWithEmailAndPassword(email, pass);
            document.getElementById('signupDialog').close();
        } catch (error) {
            alert(error.message);
        }
    });
});

// Theme Logic
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙';
}

function applyStoredTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggleBtn').textContent = '☀️';
    }
}