import os
import re
import datetime
import bcrypt
import jwt
import pymupdf as fitz
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import sessionmaker, declarative_base, Session

SECRET = os.getenv("SECRET_KEY", "dev-secret-change-me")

def now():
    return datetime.datetime.now(datetime.timezone.utc)

# ---------- Database ----------
engine = create_engine("sqlite:///./app.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=now)

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    module = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    uploaded_at = Column(DateTime, default=now)

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    marks = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=now)

Base.metadata.create_all(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- Validation schemas ----------
class SignupIn(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(max_length=72)

class AskIn(BaseModel):
    document_id: int
    question: str = Field(min_length=3)
    marks: int

# ---------- Auth helpers ----------
def make_token(user_id: int) -> str:
    exp = now() + datetime.timedelta(hours=12)
    return jwt.encode({"sub": str(user_id), "exp": exp}, SECRET, algorithm="HS256")

bearer = HTTPBearer()

def current_user(cred: HTTPAuthorizationCredentials = Depends(bearer),
                 db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(cred.credentials, SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.get(User, int(payload["sub"]))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ---------- App ----------
app = FastAPI(title="IndicAcademic AI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Auth endpoints ----------
@app.post("/auth/signup", status_code=201)
def signup(data: SignupIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    user = User(name=data.name, email=data.email, password_hash=hashed)
    db.add(user)
    db.commit()
    return {"message": "Account created"}

@app.post("/auth/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not bcrypt.checkpw(data.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": make_token(user.id), "token_type": "bearer"}

@app.get("/auth/me")
def me(user: User = Depends(current_user)):
    return {"id": user.id, "name": user.name, "email": user.email}

# ---------- Documents (CRUD) ----------
@app.post("/documents", status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    subject: str = Form(...),
    module: str = Form(...),
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB)")
    try:
        pdf = fitz.open(stream=data, filetype="pdf")
        text = "\n".join(page.get_text() for page in pdf)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read this PDF")
    if not text.strip():
        raise HTTPException(status_code=400, detail="No text found (scanned PDFs need OCR)")
    doc = Document(user_id=user.id, filename=file.filename,
                   subject=subject, module=module, content=text)
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {"id": doc.id, "filename": doc.filename}

@app.get("/documents")
def list_documents(user: User = Depends(current_user), db: Session = Depends(get_db)):
    docs = db.query(Document).filter(Document.user_id == user.id).all()
    return [{"id": d.id, "filename": d.filename, "subject": d.subject,
             "module": d.module, "uploaded_at": d.uploaded_at} for d in docs]

@app.delete("/documents/{doc_id}")
def delete_document(doc_id: int, user: User = Depends(current_user),
                    db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id,
                                    Document.user_id == user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.query(ChatHistory).filter(ChatHistory.document_id == doc_id).delete()
    db.delete(doc)
    db.commit()
    return {"message": "Deleted"}

# ---------- Exam-style question answering ----------
def tokens(text: str) -> set:
    return set(re.findall(r"[a-z]{3,}", text.lower()))

def split_sentences(text: str) -> list:
    text = re.sub(r"\s+", " ", text)
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 30]

@app.post("/ask")
def ask(data: AskIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    if data.marks not in (2, 5, 10):
        raise HTTPException(status_code=400, detail="Marks must be 2, 5 or 10")
    doc = db.query(Document).filter(Document.id == data.document_id,
                                    Document.user_id == user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    q_words = tokens(data.question)
    sentences = split_sentences(doc.content)
    scores = [len(q_words & tokens(s)) for s in sentences]
    k = {2: 2, 5: 5, 10: 8}[data.marks]
    best = sorted(range(len(sentences)), key=lambda i: scores[i], reverse=True)[:k]
    picked = sorted(i for i in best if scores[i] > 0)
    pts = [sentences[i] for i in picked]

    if not pts:
        answer = "No relevant content found in this document for the question."
    elif data.marks == 2:
        answer = " ".join(pts)
    elif data.marks == 10 and len(pts) >= 3:
        body = "\n".join(f"{n}. {p}" for n, p in enumerate(pts[1:-1], 1))
        answer = f"Introduction:\n{pts[0]}\n\nKey points:\n{body}\n\nConclusion:\n{pts[-1]}"
    else:
        answer = "\n".join(f"{n}. {p}" for n, p in enumerate(pts, 1))

    db.add(ChatHistory(user_id=user.id, document_id=doc.id, question=data.question,
                       answer=answer, marks=data.marks))
    db.commit()
    return {"answer": answer, "marks": data.marks, "subject": doc.subject,
            "module": doc.module}