# 🏥 MediMitra – AI-Powered Healthcare Assistance Platform

Mediमित्र (MediMitra) is an AI-powered healthcare assistance platform built to automate medical document processing and provide intelligent chatbot-based question answering.  
The platform helps reduce administrative workload for healthcare professionals and improves access to medical information through conversational AI.

## 📌 Problem Statement
Healthcare professionals spend a significant amount of time on documentation, insurance verification, and repetitive administrative tasks.  
This limits the time available for patient care and increases operational overhead.

## 💡 Solution
MediMitra provides a unified system that:
- Automates healthcare document processing  
- Enables conversational AI for healthcare queries  
- Offers intelligent document search using NLP and embeddings  
- Reduces paperwork and improves workflow efficiency  

The goal is to allow medical staff to focus more on **patient care** rather than **paperwork**.

## 🚀 Features
- 📄 Automated medical document ingestion and processing  
- 🤖 AI-powered chatbot for healthcare-related questions  
- 🔍 Semantic document search using NLP and embeddings  
- 🌐 Modern web-based user interface  
- ⚡ Scalable backend and microservices architecture  

## 🛠️ Tech Stack
> Frontend
- HTML  
- CSS  
- JavaScript
- 
 > Backend
- Node.js  
- Express.js  
- FastAPI (Python microservices)  
- PostgreSQL  

> AI / ML
- Python  
- Natural Language Processing (NLP)  
- Embeddings-based document retrieval  

## 🏗️ System Architecture (High Level)
- Frontend communicates with the Node.js backend  
- Backend handles APIs, authentication, and database operations  
- Python AI services process documents and handle intelligent Q&A  
- PostgreSQL stores document metadata and processed information  

## 📂 Project Structure:
<img width="421" height="841" alt="Screenshot 2026-01-21 180743" src="https://github.com/user-attachments/assets/020c627e-e7d4-464c-beb2-7c8ee9baf095" />

⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/Karthik-3110/MediMitra.git
cd MediMitra

2. Install Backend Dependencies
For Node.js backend:
cd medimitra-backend
npm install

3. Install Python AI Dependencies
For Python AI microservices:
cd ../python-ai
pip install -r requirements.txt

4. Set Up the Database
Make sure PostgreSQL is installed and running. Then execute:
psql -U your_username -d your_database -f ../database/init.sql

5. Run the Application
Start the Node.js backend:
cd ../medimitra-backend
node server.js
Start the Python AI services:
cd ../python-ai
python app.py

Open the frontend
Open frontend/index.html in your browser or serve it via a local server.

Documment link - https://siescms-my.sharepoint.com/:w:/g/personal/karthikvmce124_gst_sies_edu_in/IQBWlQa7XDJtS5ZpVsqEUG9UAd5wtdM6VHY2Zdt96r9uJls?e=SHNxJ1


