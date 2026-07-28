import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../authStore';
import { ROUTES } from '../../../shared/constants/routes';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('user@botivate.com');
  const [password, setPassword] = useState('Password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(email, password, 'user');
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left Illustration Section */}
      <div className="hidden lg:flex bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white p-12 flex-col justify-center items-center relative overflow-hidden">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
            <Sparkles size={32} className="text-amber-400 logo-sparkle" />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-wide">LUCKY DRAW</h2>
            <p className="text-sm font-semibold opacity-70 mt-1 uppercase tracking-wider">Management System</p>
          </div>
          <div className="space-y-3 pt-4 border-t border-white/10 text-sm font-medium text-slate-200">
            <div className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Reserve Unique 000–999 Invoice Number</div>
            <div className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> View Official Event Digital Ticket</div>
            <div className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Real-Time Winner Draw Updates</div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="bg-white p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-black text-blue-900">Participant Sign In</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">Enter your credentials to access your ticket and reserve numbers.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold">{errorMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User size={13} /> Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@botivate.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Lock size={13} /> Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs font-medium pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-semibold">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-blue-900 rounded-md cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button 
                type="button" 
                className="text-blue-600 font-bold hover:underline cursor-pointer"
                onClick={() => alert("Password reset functionality is disabled in demo mode. Use password: Password123")}
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-blue-900 text-white rounded-xl font-extrabold text-sm hover:bg-blue-950 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Sign In to User Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <span className="font-black text-slate-500 uppercase tracking-wider block text-[10px]">Demo User Credentials</span>
            <div className="font-semibold text-slate-700">Email: <code className="bg-slate-200 px-1.5 py-0.5 rounded-md text-blue-900 font-bold">user@botivate.com</code></div>
            <div className="font-semibold text-slate-700">Password: <code className="bg-slate-200 px-1.5 py-0.5 rounded-md text-blue-900 font-bold">Password123</code></div>
          </div>

          <div className="text-center text-xs font-semibold text-slate-500 pt-2">
            <span>Are you an Administrator? </span>
            <Link to={ROUTES.ADMIN_LOGIN} className="text-blue-900 font-extrabold hover:underline inline-flex items-center gap-1">
              <ShieldCheck size={14} /> Go to Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
