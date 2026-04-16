from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from .models import Book
from .serializers import BookSerializer
from .scraper import scrape_books
from .rag import index_books, query_rag, get_similar_books
from django.core.cache import cache

class BookList(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BookDetail(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

@api_view(['GET'])
def recommend_books(request, pk):
    try:
        book = Book.objects.get(id=pk)
        similar_ids = get_similar_books(book.id, book.description)
        if similar_ids:
            books = Book.objects.filter(id__in=similar_ids)
        else:
            books = Book.objects.exclude(id=pk).order_by('-rating')[:3]
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=404)
        
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def upload_books(request):
    books = scrape_books()
    index_books(books)
    cache.clear() # Invalidate cache after new data
    return Response({"message": f"Scraped and indexed {len(books)} books successfully."})

@api_view(['POST'])
def ask_question(request):
    question = request.data.get('question')
    if not question:
        return Response({"error": "Question is required"}, status=400)
    
    cache_key = f"rag_answer_{hash(question)}"
    cached_response = cache.get(cache_key)
    
    if cached_response:
        return Response(cached_response)

    response_data = query_rag(question)
    cache.set(cache_key, response_data, timeout=3600)  # Cache for 1 hour
    return Response(response_data)
