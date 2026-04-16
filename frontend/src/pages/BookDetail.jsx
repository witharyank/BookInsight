import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, Target } from 'lucide-react';
import { bookService } from '../services/api';
import BookCard from '../components/BookCard';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      bookService.getBookById(id),
      bookService.getRecommendations(id)
    ]).then(([bookRes, recRes]) => {
      setBook(bookRes.data);
      setRecommendations(recRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="animate-pulse w-full max-w-4xl mx-auto">
      <div className="h-4 bg-slate-200 rounded w-24 mb-6"></div>
      <div className="h-64 bg-white rounded-3xl mb-8"></div>
    </div>
  );

  if (!book) return <div className="text-center py-12 text-slate-500 font-medium text-lg">Book not found.</div>;

  return (
    <div className="w-full max-w-5xl mx-auto">
       <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:underline mb-6 py-2">
         <ArrowLeft className="w-4 h-4" /> Back to Dashboard
       </Link>

       <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 mb-12">
         <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">{book.title}</h1>
         
         <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium mb-10 pb-10 border-b border-slate-100">
            <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-700">
               Written by <span className="font-bold text-slate-900">{book.author}</span>
            </span>
            <span className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl text-amber-700">
               <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
               <span className="font-bold">{book.rating}</span> / 5 Rating
            </span>
         </div>
         
         <div className="prose prose-lg text-slate-700 leading-relaxed max-w-none">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Synopsis</h3>
            <p>{book.description}</p>
         </div>
       </div>

       {recommendations.length > 0 && (
         <div>
            <h3 className="text-2xl font-bold flex items-center gap-3 mb-6 px-2">
              <Target className="text-indigo-600 w-6 h-6" /> 
              Recommended Similar Reads
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map(rec => (
                 <BookCard key={rec.id} book={rec} />
              ))}
            </div>
         </div>
       )}
    </div>
  );
}
