import { Outlet, NavLink } from 'react-router-dom';
import { Home, BarChart2, Clock, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Layout() {
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen flex-col bg-[#F7F5F2]">
      <header className="flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm sticky top-0 z-10 rounded-b-3xl">
        <h1 className="text-xl font-extrabold text-stone-800 tracking-tight">家务大作战 🧹</h1>
        <button onClick={signOut} className="rounded-full bg-stone-100 p-2 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-28">
        <Outlet />
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
        <nav className="flex items-center justify-around rounded-3xl bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-100">
          <NavLink
            to="/chores"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center rounded-2xl p-3 text-xs font-bold transition-all",
                isActive ? "bg-stone-800 text-white scale-105" : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
              )
            }
          >
            <Home size={22} className="mb-1" />
            打卡
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center rounded-2xl p-3 text-xs font-bold transition-all",
                isActive ? "bg-stone-800 text-white scale-105" : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
              )
            }
          >
            <BarChart2 size={22} className="mb-1" />
            看板
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center rounded-2xl p-3 text-xs font-bold transition-all",
                isActive ? "bg-stone-800 text-white scale-105" : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
              )
            }
          >
            <Clock size={22} className="mb-1" />
            历史
          </NavLink>
          <NavLink
            to="/manage"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center rounded-2xl p-3 text-xs font-bold transition-all",
                isActive ? "bg-stone-800 text-white scale-105" : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
              )
            }
          >
            <Settings size={22} className="mb-1" />
            管理
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
