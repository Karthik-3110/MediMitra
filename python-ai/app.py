from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from chatbot import medisuite_chatbot
import uuid
import io
import pytesseract
from PIL import Image
import pdfplumber

# -------------------- APP INIT --------------------
app = FastAPI(
    title="Mediमित्र AI Agent",
    description="Groq-powered Medical & Insurance AI Backend",
    version="1.0"
)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- SESSION MEMORY --------------------
sessions = {}   # { session_id : [ {role, content}, ... ] }

# -------------------- MODELS --------------------
class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    language: str = "en"

class ChatResponse(BaseModel):
    reply: str
    session_id: str

# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {"status": "Mediमित्र AI backend running 🚀"}

# -------------------- HEALTH CHECK --------------------
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Mediमित्र AI"}

# -------------------- CHAT ENDPOINT --------------------
@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    # Create new session if not provided
    if request.session_id is None:
        session_id = str(uuid.uuid4())
        sessions[session_id] = []
    else:
        session_id = request.session_id
        sessions.setdefault(session_id, [])

    # Add language context to the message
    language_context = f"[User is speaking in {request.language} language. Respond in the same language.] "
    full_message = language_context + request.message

    # Call Groq chatbot
    reply = medisuite_chatbot(
        user_message=full_message,
        history=sessions[session_id]
    )

    # Save conversation history
    sessions[session_id].append(
        {"role": "user", "content": request.message}
    )
    sessions[session_id].append(
        {"role": "assistant", "content": reply}
    )

    return {
        "reply": reply,
        "session_id": session_id
    }

# -------------------- DOCUMENT UPLOAD (OCR) --------------------
@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    extracted_text = ""
    
    try:
        # Read file content
        contents = await file.read()
        
        # PDF handling
        if file.filename.lower().endswith(".pdf"):
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
        
        # Image handling
        elif file.filename.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".tiff")):
            image = Image.open(io.BytesIO(contents))
            extracted_text = pytesseract.image_to_string(image)
        
        else:
            return {
                "error": "Unsupported file format. Upload PDF or image (PNG, JPG, JPEG)."
            }
        
        if not extracted_text.strip():
            extracted_text = "No text could be extracted from the document."
        
        return {
            "filename": file.filename,
            "extracted_text": extracted_text[:5000],  # limit output size
            "char_count": len(extracted_text)
        }
        
    except Exception as e:
        return {
            "error": f"Error processing file: {str(e)}"
        }

# -------------------- SESSION MANAGEMENT --------------------
@app.get("/sessions")
def list_sessions():
    return {"active_sessions": len(sessions)}

@app.delete("/session/{session_id}")
def clear_session(session_id: str):
    if session_id in sessions:
        del sessions[session_id]
        return {"message": f"Session {session_id} cleared"}
    return {"error": "Session not found"}