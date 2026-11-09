import os
import datetime
import bcrypt
import jwt
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, Session

SECRET = os.getenv("SECRET_KEY", "dev-secret-change-me")

def now():
    return datetime.datetime.now(datetime.timezone.utc)

# Database
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

Base.metadata.create_all(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Validation schemas
class SignupIn(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(max_length=72)

# Auth helpers
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

# App
app = FastAPI(title="IndicAcademic AI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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