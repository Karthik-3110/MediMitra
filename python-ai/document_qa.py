import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def answer_from_document(document_text: str, question: str) -> str:
    prompt = f"""
You are a strict document reader.

Rules:
- Answer ONLY from the document
- If the answer is not in the document, say exactly:
  "Answer not found in the document."

DOCUMENT:
{document_text}

QUESTION:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "Answer strictly from the document."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        max_tokens=400
    )

    return response.choices[0].message.content.strip()
