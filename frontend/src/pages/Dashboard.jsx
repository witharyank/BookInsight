import { useState, useEffect } from 'react';
import { Library, FolderOpen } from 'lucide-react';
import { bookService } from '../services/api';
import BookCard from '../components/BookCard';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    bookService.getAllBooks()
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch library connection.');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="animate-pulse w-full max-w-7xl mx-auto">
      <div className="h-10 bg-slate-200/50 rounded-xl w-48 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-white/50 rounded-2xl border border-slate-100 shadow-sm"></div>)}
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-medium max-w-2xl mx-auto text-center shadow-sm">
      <span className="block text-2xl mb-2">⚠️</span>
      {error}
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-10 text-center flex flex-col items-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-3">
          <Library className="text-indigo-500 w-8 h-8 lg:w-10 lg:h-10 drop-shadow-sm" /> 
          Platform Catalog
        </h1>
        <p className="text-slate-500 mt-3 text-lg font-medium">Browse deep intelligence extracted from your database.</p>
      </div>

      {books.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md shadow-sm border border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center mt-10">
          <div className="bg-indigo-50 p-6 rounded-full mb-6">
            <FolderOpen className="text-indigo-400 w-16 h-16" />
          </div>
          <p className="text-2xl text-slate-700 font-extrabold mb-3 tracking-tight">No books found in the vault 📚</p>
          <p className="text-slate-500 font-medium text-lg max-w-md">Click the "Sync Library" button in the navigation bar to scrape and generate embeddings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      )}
    </div>
  );
}
