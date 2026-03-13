import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Sparkles } from 'lucide-react';

export default function Login() {
  const { user, signInAs } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/chores');
    }
  }, [user, navigate]);

  const handleLogin = async (name: 'dd' | 'qq') => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await signInAs(name);
    } catch (err: any) {
      setError(`登录失败: ${err.message || '未知错误'}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F5F2] p-4">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
        
        <div className="relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 rounded-full bg-stone-100 p-4 shadow-sm">
            <Heart className="h-10 w-10 text-stone-800 fill-stone-800" />
          </div>
          <h2 className="mt-8 text-3xl font-black text-stone-800 tracking-tight">
            家务大作战 <Sparkles className="inline h-6 w-6 text-amber-400" />
          </h2>
          <p className="mt-3 text-stone-500 font-medium">
            欢迎回家！请选择你的专属身份 🏡
          </p>
        </div>
        
        <div className="mt-10 grid grid-cols-2 gap-6">
          <button
            onClick={() => handleLogin('dd')}
            disabled={isLoggingIn}
            className="group relative flex flex-col items-center justify-center space-y-4 rounded-3xl border-4 border-transparent bg-sky-50/50 p-6 text-stone-600 transition-all hover:-translate-y-2 hover:border-stone-100 hover:bg-stone-50 hover:shadow-xl hover:shadow-stone-200/50 active:scale-95 disabled:opacity-50"
          >
            <div className="text-5xl transition-transform group-hover:scale-110">👦🏻</div>
            <div>
              <span className="block text-xl font-extrabold text-stone-800">我是 dd</span>
              <span className="mt-1 block text-sm font-bold text-stone-400">男主人</span>
            </div>
          </button>

          <button
            onClick={() => handleLogin('qq')}
            disabled={isLoggingIn}
            className="group relative flex flex-col items-center justify-center space-y-4 rounded-3xl border-4 border-transparent bg-rose-50/50 p-6 text-stone-600 transition-all hover:-translate-y-2 hover:border-stone-100 hover:bg-stone-50 hover:shadow-xl hover:shadow-stone-200/50 active:scale-95 disabled:opacity-50"
          >
            <div className="text-5xl transition-transform group-hover:scale-110">👧🏻</div>
            <div>
              <span className="block text-xl font-extrabold text-stone-800">我是 qq</span>
              <span className="mt-1 block text-sm font-bold text-stone-400">女主人</span>
            </div>
          </button>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 p-4 border border-red-100">
            <h3 className="text-sm font-bold text-red-600">
              {error.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
