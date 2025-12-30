from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import pdfplumber
import io

from document_qa import answer_from_document

load_dotenv()

app = FastAPI(title="Document Reader API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DOCUMENT_TEXT = ""

@app.get("/health")
def health():
    return {"status": "documents backend running"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    global DOCUMENT_TEXT

    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Only PDF allowed"}

    content = await file.read()
    text = ""

    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    if not text.strip():
        return {"error": "No readable text in PDF"}

    DOCUMENT_TEXT = text

    return {
        "message": "PDF uploaded successfully",
        "characters": len(DOCUMENT_TEXT),
        "preview": DOCUMENT_TEXT[:500]
    }

class Question(BaseModel):
    question: str

@app.post("/ask")
def ask_question(data: Question):
    if not DOCUMENT_TEXT:
        return {"error": "Upload a document first"}

    answer = answer_from_document(
        document_text=DOCUMENT_TEXT,
        question=data.question
    )

    return {"answer": answer}
