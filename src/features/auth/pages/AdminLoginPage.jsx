import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, User } from 'lucide-react';
import { useAuthStore } from '../authStore';
import { ROUTES } from '../../../shared/constants/routes';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('admin@botivate.com');
  const [password, setPassword] = useState('Password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(email, password, 'admin');
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      navigate(ROUTES.ADMIN);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left Illustration Section */}
      <div className="hidden lg:flex bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white p-12 flex-col justify-center items-center relative overflow-hidden">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
            <ShieldCheck size={36} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-wide">ADMIN CONSOLE</h2>
            <p className="text-sm font-semibold opacity-70 mt-1 uppercase tracking-wider">Lucky Draw Management System</p>
          </div>
          <div className="space-y-3 pt-4 border-t border-white/10 text-sm font-medium text-slate-200">
            <div className="flex items-center gap-2"><span className="text-blue-400 font-bold">✓</span> Event & Timing Management</div>
            <div className="flex items-center gap-2"><span className="text-blue-400 font-bold">✓</span> 5-Rank Sequential Winner Draw Engine</div>
            <div className="flex items-center gap-2"><span className="text-blue-400 font-bold">✓</span> Participant Analytics & CSV/Excel/PDF Exports</div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="bg-white p-5 sm:p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Administrator Sign In</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">Access the control dashboard, manage prizes, and execute live draw.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold">{errorMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User size={13} /> Admin Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@botivate.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-slate-800 focus:ring-4 focus:ring-slate-100 transition-all bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Lock size={13} /> Admin Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-slate-800 focus:ring-4 focus:ring-slate-100 transition-all bg-white"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs font-medium pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-semibold">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 rounded-md cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button 
                type="button" 
                className="text-slate-700 font-bold hover:underline cursor-pointer"
                onClick={() => alert("Password reset functionality is disabled in demo mode. Use password: Password123")}
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-extrabold text-sm hover:bg-slate-950 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Sign In to Admin Console</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <span className="font-black text-slate-500 uppercase tracking-wider block text-[10px]">Demo Admin Credentials</span>
            <div className="font-semibold text-slate-700">Email: <code className="bg-slate-200 px-1.5 py-0.5 rounded-md text-slate-900 font-bold">admin@botivate.com</code></div>
            <div className="font-semibold text-slate-700">Password: <code className="bg-slate-200 px-1.5 py-0.5 rounded-md text-slate-900 font-bold">Password123</code></div>
          </div>

          <div className="text-center text-xs font-semibold text-slate-500 pt-2">
            <span>Participant User? </span>
            <Link to={ROUTES.LOGIN} className="text-slate-900 font-extrabold hover:underline">
              Go to User Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
