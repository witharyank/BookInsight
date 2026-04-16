import { Link } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';

export default function BookCard({ book }) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
      
      {/* Book Cover Placeholder */}
      <div className="w-full h-40 bg-gradient-to-tr from-indigo-100 to-blue-50 rounded-xl mb-5 flex items-center justify-center text-indigo-300 group-hover:from-indigo-200 group-hover:text-indigo-400 transition-colors">
         <BookOpen className="w-12 h-12 opacity-50" />
      </div>

      <h3 className="text-xl font-bold mb-1 text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{book.title}</h3>
      <p className="text-sm font-semibold text-slate-400 mb-4 line-clamp-1">{book.author}</p>
      
      <div className="flex items-center gap-1.5 mb-6 mt-auto">
        <div className="bg-amber-100 flex items-center gap-1.5 px-2.5 py-1 rounded-lg">
           <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
           <span className="text-sm font-bold text-amber-700">{book.rating}</span>
        </div>
      </div>
      
      <Link 
        to={`/book/${book.id}`} 
        className="block text-center w-full bg-slate-50 border border-slate-100 text-indigo-600 font-bold py-2.5 rounded-xl group-hover:bg-indigo-50 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}
