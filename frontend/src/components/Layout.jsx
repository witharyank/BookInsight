import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100 min-h-screen font-sans text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="w-full max-w-6xl mx-auto pt-10 pb-12 px-4 flex-1 flex flex-col items-center">
        <Outlet />
      </main>
    </div>
  );
}
