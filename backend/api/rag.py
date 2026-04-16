import os
import requests
import chromadb
from chromadb.utils import embedding_functions
from django.conf import settings

# Initialize ChromaDB client
CHROMA_DB_PATH = os.path.join(settings.BASE_DIR, 'chroma_db')
chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

embedder = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
collection = chroma_client.get_or_create_collection(name="books_collection", embedding_function=embedder)

LM_STUDIO_URL = getattr(settings, 'LM_STUDIO_URL', "http://127.0.0.1:1234/v1/completions")

def chunk_text(text, chunk_size=200, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def index_books(books):
    for book in books:
        if not book.description:
            continue
        chunks = chunk_text(book.description)
        for i, chunk in enumerate(chunks):
            # Use upsert to handle duplicates cleanly without failing
            collection.upsert(
                documents=[chunk],
                metadatas=[{"book_id": book.id, "title": book.title, "author": book.author}],
                ids=[f"book_{book.id}_chunk_{i}"]
            )

def query_rag(question):
    enhanced_question = question + " themes meaning summary plot psychology"
    
    results = collection.query(
        query_texts=[enhanced_question],
        n_results=5
    )

    context = ""
    sources = set()
    if results['documents'] and len(results['documents'][0]) > 0:
        for i, doc in enumerate(results['documents'][0]):
            metadata = results['metadatas'][0][i]
            context += f"From '{metadata['title']}' by {metadata['author']}: {doc}\n\n"
            sources.add(metadata['title'])

    prompt_text = f"""You are an AI reading assistant.

Answer the question using ONLY the provided context.

You MAY:
* Infer themes (dark, emotional, psychological, etc.)
* Summarize meaning from the text

BUT:
* Do NOT add specific plot details, characters, or facts unless clearly present in the context
* Do NOT use outside knowledge

If the answer is incomplete, say:
'The context suggests possible themes, but does not provide full details.'

Context:
{context}

User Question:
{question}

Answer clearly and concisely."""

    payload = {
        "model": "mistralai/ministral-3-3b",
        "prompt": prompt_text,
        "temperature": 0.7,
        "max_tokens": 500
    }

    try:
        response = requests.post(LM_STUDIO_URL, json=payload, timeout=30)
        
        try:
            data = response.json()
            print("LM RESPONSE:", data)
            answer = data["choices"][0]["text"]
        except Exception:
            answer = str(data) if 'data' in locals() else str(response.text)
            
        return {
            "answer": answer.strip(),
            "sources": list(sources),
            "error": None
        }
    except requests.exceptions.RequestException as e:
        return {
            "answer": "",
            "sources": list(sources),
            "error": f"Error connecting to local LLM: {str(e)}"
        }

def get_similar_books(book_id, description, top_k=3):
    if not description:
        return []
    results = collection.query(
        query_texts=[description],
        n_results=top_k + 5 
    )
    similar_ids = []
    if results['metadatas'] and len(results['metadatas'][0]) > 0:
        for metadata in results['metadatas'][0]:
            bid = metadata['book_id']
            if str(bid) != str(book_id) and bid not in similar_ids:
                similar_ids.append(bid)
            if len(similar_ids) == top_k:
                break
    return similar_ids
