import os
from dotenv import load_dotenv

load_dotenv()

raw_key = os.getenv("GROQ_API_KEY")

if not raw_key:
    raise RuntimeError("GROQ_API_KEY missing")

# 🔥 ABSOLUTE FIX
GROQ_API_KEY = raw_key.replace("\n", "").replace("\r", "").strip()
