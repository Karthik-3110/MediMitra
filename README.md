# MediMitra
Mediमित्र is a AI healthcare platform that automates document processing and enables intelligent chatbot-based Q&amp;A using FastAPI, Node.js, PostgreSQL, and a modern web frontend.

Healthcare professionals spend a significant amount of time on documentation, insurance verification, and repetitive administrative work. Mediमित्र addresses this challenge by providing a unified platform that combines a modern web interface with backend services and AI-based document processing.

The goal of Mediमित्र is to reduce operational overhead and allow healthcare staff to focus more on patient care rather than paperwork.

Git Steps (How to Access the Project)

Clone the repository
git clone https://github.com/Karthik-3110/MediMitra.git

Move into the project directory
cd MediMitra

Install dependencies (for backend)
npm install

Set up environment variables
cp .env.example .env

(Add required keys in .env)
Run the backend server(inside medimitra-backend)
npm run dev

Run Python AI service

cd python-ai
pip install -r requirements.txt

in terminal 1
uvicorn app:app --port 8000 --reload

in terminal 2
uvicorn documents_app:app --port 8001 --reload

Open the frontend
Open frontend/index.html in a browser



🛠️ Tech Stack
Frontend
HTML
CSS
JavaScript

Backend
Node.js
Express.js

AI / ML
Python
AI-based document processing (NLP & embeddings)


