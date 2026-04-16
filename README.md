# Book Insight Platform

A complete full-stack AI-powered web application that scrapes book data, stores it, generates AI insights, and supports intelligent question-answering using a RAG (Retrieval-Augmented Generation) pipeline.

## Technologies Used
* **Backend**: Django, Django REST Framework, SQLite
* **Frontend**: React (Vite), Tailwind CSS
* **Vector DB**: ChromaDB
* **Embeddings**: sentence-transformers
* **AI Provider**: Local LLM via LM Studio
* **Scraping**: BeautifulSoup

## Project Structure
- `backend/` - Django application containing the API, Scraper, and RAG Pipeline
- `frontend/` - React application styled with Tailwind CSS

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the project directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate # Mac/Linux
   ```
3. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers requests beautifulsoup4 chromadb sentence-transformers openai
   ```
4. Run database migrations:
   ```bash
   python manage.py makemigrations api
   python manage.py migrate
   ```
5. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (e.g., `http://localhost:5173`) in your browser.

### 3. LM Studio Setup (Local LLM)
1. Download models using LM Studio.
2. Start the Local Inference Server on port 1234 (`http://localhost:1234/v1`).
3. Ensure CORS is enabled on LM Studio.

## API Documentation

### Endpoints
* **`GET /api/books/`** 
  Lists all stored books.
* **`GET /api/books/<id>/`** 
  Retrieves detail information for a specific book.
* **`GET /api/recommend/<id>/`** 
  Retrieves AI-recommended books similar to the specified book.
* **`POST /api/upload/`** 
  Triggers scraping of `books.toscrape.com`, chunks descriptions, embeds them, and uploads them to ChromaDB.
* **`POST /api/ask/`** 
  Sends a user question to the RAG pipeline, retrieves context, and queries the LLM for an answer.
  *Body:* `{"question": "What is this book about?"}`

## Sample Q&A
**User**: What are some good books about poetry?
**AI Chatbot**: Based on the library, "A Light in the Attic" by Shel Silverstein is highly recommended with a 5-star rating...

**User**: Who wrote "Tipping the Velvet"?
**AI Chatbot**: The available context does not specify the author for "Tipping the Velvet", but it has a description concerning Victorian England.

