import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, Mail, Lock, User, ArrowRight, 
  Eye, EyeOff, ShieldCheck, CheckCircle2, Star 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

import useAuth from '../../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'business'
      });

      toast.success('Business account created!');
      navigate('/onboarding');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // MAIN CONTAINER: Applied zoom style here as requested
    // "zoom" property works in Chrome/Edge/Safari. 
    // For Firefox support, one would typically use transform: scale(0.8), but zoom is more consistent for layout flow.
    <div 
      className="min-h-screen w-full flex bg-slate-950 font-sans selection:bg-indigo-500/30 overflow-x-hidden"
      style={{ zoom: '80%' }}
    >
      
      {/* LEFT SIDE - Form Area (Full width on mobile, Half on desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12 relative z-10">
        
        {/* Mobile Background Glow (Hidden on Desktop) */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />
             <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[420px] space-y-6 relative"
        >
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
              <span className="font-bold text-base">C</span>
            </div>
            <span className="text-2xl font-bold text-slate-100 tracking-tight">CredFlow</span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
              Start your free trial
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Join 4,000+ finance teams managing expenses better.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-800 text-slate-200 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 hover:border-slate-700 hover:bg-slate-900/80"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900/50 border border-slate-800 text-slate-200 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 hover:border-slate-700 hover:bg-slate-900/80"
                />
              </div>
            </div>

            {/* Password Row (Stacks on very small screens, side-by-side on larger) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-slate-800 text-slate-200 text-sm rounded-xl pl-11 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 hover:border-slate-700 hover:bg-slate-900/80"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 ml-1">Confirm</label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full bg-slate-900/50 border text-slate-200 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-600 hover:border-slate-700 hover:bg-slate-900/80 ${
                      error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-slate-800 focus:ring-indigo-500/50 focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Validation / Helper Text */}
            <div className="flex justify-between items-start min-h-[20px]">
              <p className={`text-[11px] font-medium ${error ? 'text-red-400' : 'text-slate-500'} ml-1`}>
                {error || 'Must be at least 8 characters long'}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-sm font-bold tracking-wide">Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            </button>

            {/* Footer Text */}
            <p className="text-center text-xs text-slate-500 mt-6 font-medium">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-all"
              >
                Log in
              </Link>
            </p>
          </form>

          {/* Security Badge */}
          <div className="pt-6 border-t border-slate-800/50 flex items-center justify-center gap-2 text-slate-500 opacity-80">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-semibold tracking-wider uppercase">256-bit Secure Encryption</span>
          </div>

        </motion.div>
      </div>

      {/* RIGHT SIDE - Art & Social Proof (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0B0F19] overflow-hidden items-center justify-center border-l border-slate-800/50">
        
        {/* Background Gradients */}
        <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen" />
        
        {/* Content Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative z-10 max-w-sm"
        >
          {/* Testimonial Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative group hover:border-slate-600/50 transition-colors">
            {/* Decoration Icon */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>

            <p className="text-lg text-slate-200 font-medium leading-relaxed mb-6">
              "CredFlow completely transformed how we handle business expenses. The automated reports save us <span className="text-indigo-400 font-bold">40+ hours</span> every single month."
            </p>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-slate-900">
                JD
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Jane Davis</h4>
                <p className="text-slate-400 text-xs font-medium">CFO at TechGrowth Inc.</p>
              </div>
            </div>
          </div>

          {/* Floating Feature Pills */}
          <div className="absolute -right-12 top-[-40px] bg-slate-800/80 backdrop-blur-md border border-slate-700 py-2.5 px-5 rounded-full flex items-center gap-2.5 shadow-xl animate-bounce-slow hover:scale-105 transition-transform cursor-default">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-xs text-slate-200 font-bold tracking-wide">Real-time Analytics</span>
          </div>
          
          <div className="absolute -left-8 bottom-[-30px] bg-slate-800/80 backdrop-blur-md border border-slate-700 py-2.5 px-5 rounded-full flex items-center gap-2.5 shadow-xl animate-bounce-slow delay-700 hover:scale-105 transition-transform cursor-default">
             <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-slate-200 font-bold tracking-wide">No credit card required</span>
          </div>

        </motion.div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      </div>

    </div>
  );
};

export default Register;