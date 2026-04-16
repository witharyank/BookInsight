import requests
from bs4 import BeautifulSoup
from .models import Book

def scrape_books():
    """Scrape books from books.toscrape.com and save to DB."""
    url = "https://books.toscrape.com/"
    response = requests.get(url)
    if response.status_code != 200:
        print("Failed to scrape")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    books_data = []

    articles = soup.find_all('article', class_='product_pod')
    for article in articles:
        title = article.h3.a['title']
        book_url = url + article.h3.a['href']
        
        # Scrape detail page for description
        detail_response = requests.get(book_url)
        description = "No description available."
        if detail_response.status_code == 200:
            detail_soup = BeautifulSoup(detail_response.text, 'html.parser')
            desc_tag = detail_soup.find('div', id='product_description')
            if desc_tag and desc_tag.find_next_sibling('p'):
                description = desc_tag.find_next_sibling('p').text

        rating_tag = article.find('p', class_='star-rating')
        rating_classes = rating_tag['class']
        rating = 0.0
        if 'One' in rating_classes: rating = 1.0
        elif 'Two' in rating_classes: rating = 2.0
        elif 'Three' in rating_classes: rating = 3.0
        elif 'Four' in rating_classes: rating = 4.0
        elif 'Five' in rating_classes: rating = 5.0

        book, created = Book.objects.get_or_create(
            title=title,
            defaults={
                'author': 'Unknown Author', # The site doesn't have authors explicitly on the list page
                'rating': rating,
                'description': description,
                'url': book_url
            }
        )
        books_data.append(book)

    return books_data
