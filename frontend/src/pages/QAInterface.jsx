import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, BookCopy } from 'lucide-react';
import { bookService } from '../services/api';

export default function QAInterface() {
  const [messages, setMessages] = useState([{ role: 'ai', content: 'Hello! I am your AI Library Assistant. Ask me anything about the books in our vault.' }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await bookService.askQuestion(userMessage.content);
      
      if (res.data.error) {
         setMessages(prev => [...prev, { role: 'ai', content: res.data.error }]);
      } else {
         const answerValue = res.data.answer && res.data.answer.trim() !== "" 
             ? res.data.answer 
             : "The AI returned an empty response. Please try again or rephrase your question.";
         const aiMessage = { 
           role: 'ai', 
           content: answerValue,
           sources: res.data.sources || []
         };
         setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Failed to connect to the AI engine. Please ensure your backend and LM Studio are running. Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)] bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl overflow-hidden mt-4">
       {/* Header */}
       <div className="bg-white/80 border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-inner">
               <Sparkles className="text-white w-5 h-5" />
             </div>
             <div>
               <h2 className="font-extrabold text-lg text-slate-800 tracking-tight">AI Book Assistant</h2>
               <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">RAG Engine Online</p>
             </div>
          </div>
       </div>

       {/* Chat Window */}
       <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
          {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] lg:max-w-[75%] relative ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                  {msg.role === 'ai' && (
                     <div className="absolute -left-10 top-0 bg-white border border-slate-200 p-1.5 rounded-full shadow-sm hidden sm:block">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                     </div>
                  )}
                  
                  <div className={`
                    p-5 rounded-2xl shadow-sm leading-relaxed text-[15px]
                    ${msg.role === 'user' 
                      ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-tr-sm font-medium' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'}
                  `}>
                    {/* Render Basic Markdown (Bold/Italic/Newlines) */}
                    <div className="space-y-2">
                       {msg.content.split('\n').map((line, i) => (
                          <p key={i}>
                            {line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
                               if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={j} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                               } else if (part.startsWith('*') && part.endsWith('*')) {
                                  return <em key={j} className="italic text-slate-800">{part.slice(1, -1)}</em>;
                               }
                               return <span key={j}>{part}</span>;
                            })}
                          </p>
                       ))}
                    </div>
                    
                    {/* Render Sources if available */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><BookCopy className="w-3 h-3"/> Context Sources</p>
                         <div className="flex flex-wrap gap-1.5">
                           {msg.sources.map((s, i) => (
                             <span key={i} className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded-md text-[11px] font-semibold">
                               {s}
                             </span>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>
               </div>
             </div>
          ))}
          
          {loading && (
             <div className="flex justify-start">
               <div className="max-w-[85%] relative pl-10 sm:pl-0 order-2">
                 <div className="absolute -left-10 top-0 bg-white border border-slate-200 p-1.5 rounded-full shadow-sm hidden sm:block">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                 </div>
                 <div className="bg-white border border-slate-100 p-5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3 text-slate-500 font-medium">
                   <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                   Thinking...
                 </div>
               </div>
             </div>
          )}
          <div ref={endOfMessagesRef} />
       </div>

       {/* Chat Input */}
       <div className="bg-white p-4 border-t border-slate-100 z-10 w-full">
         <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto w-full">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about the books..." 
              className="w-full bg-slate-50 border-2 border-slate-100 text-slate-800 rounded-2xl pl-5 pr-16 py-4 focus:outline-none focus:border-indigo-400 focus:bg-white font-medium transition-all shadow-inner"
            />
            <button 
              disabled={loading || !input.trim()}
              className="absolute right-2 p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl shadow-md disabled:opacity-50 disabled:scale-100 hover:scale-105 transition-all duration-300"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
         </form>
         <p className="text-center text-[10px] text-slate-400 mt-2 font-semibold">AI can make mistakes. Verify important facts.</p>
       </div>
    </div>
  );
}
