from groq import Groq
from config import GROQ_API_KEY

client = Groq(
    api_key=GROQ_API_KEY,
    timeout=30,
)

SYSTEM_PROMPT = """
You are Mediमित्र AI Agent, a professional medical and insurance workflow assistant.

Expertise:
- ICD-10 diagnosis codes
- CPT-4 procedure codes
- CMS-1500 claim forms
- Hospital & insurance workflows
- Clinical documentation analysis

Rules:
- Use correct medical terminology
- Be concise and accurate
- Do NOT give treatment advice
- Respond in user's language
"""

def medisuite_chatbot(user_message: str, history: list):
    try:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
        ]

        # Add history safely
        for msg in history[-6:]:
            messages.append(msg)

        messages.append({"role": "user", "content": user_message})

        # ✅ CORRECT GROQ CALL
        completion = client.chat.completions.create(
    model="llama-3.1-8b-instant",  # ✅ correct model
    messages=messages,
    temperature=0.2,
    max_tokens=400,
)


        return completion.choices[0].message.content

    except Exception as e:
        print("❌ Groq error:", e)
        return "⚠️ Mediमित्र AI is temporarily unavailable. Please try again."
