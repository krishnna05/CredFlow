import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, ShieldCheck, Zap,
  BarChart3, FileText, Lock, ChevronRight, PlayCircle,
  Server, Database, CreditCard, Webhook
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Component Imports
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import CreditScoreGauge from '../analytics/CreditScoreGauge';
import StatCard from '../../components/dashboard/StatCard';
import FraudAlertBox from '../analytics/FraudAlertBox';
import RiskTrendChart from '../analytics/RiskTrendChart';
import Modal from '../../components/common/Modal'; //

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  const [gaugeScore, setGaugeScore] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false); // New state for Demo Modal

  useEffect(() => {
    const timer = setTimeout(() => setGaugeScore(78), 500);
    return () => clearTimeout(timer);
  }, []);

  const riskTrendData = [
    { date: 'Jan', score: 65 },
    { date: 'Feb', score: 68 },
    { date: 'Mar', score: 72 },
    { date: 'Apr', score: 71 },
    { date: 'May', score: 75 },
    { date: 'Jun', score: 78 },
  ];

  const fraudCheckData = {
    status: 'PASS',
    riskScore: 12,
    flaggedFields: []
  };

  return (
    <div
      className="min-h-screen w-full bg-slate-950 font-sans selection:bg-indigo-500/30 overflow-x-hidden text-slate-200"
      style={{ zoom: '80%' }}
    >

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-[72px] md:h-20 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-xl md:text-xl">C</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">CredFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">How it Works</a>
            <a href="#developers" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Developers</a>
          </div>

          {/* Mobile/Desktop Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/login" className="text-xs md:text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Log In
            </Link>
            <Button
              variant="accent"
              onClick={() => navigate('/register')}
              className="rounded-full px-4 py-2 text-xs md:px-6 md:py-2.5 md:text-sm font-bold shadow-[0_0_20px_rgba(209,243,75,0.3)] hover:shadow-[0_0_30px_rgba(209,243,75,0.5)] transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-32 bg-slate-950 overflow-hidden z-10">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-1000" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-24">

            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:w-1/2 space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                New: AI Risk Engine v2.0
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                Smarter Invoice Financing for<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Modern Businesses
                </span>
              </h1>

              <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
                Upload your invoice and get an instant credit score, risk analysis, and financing decision powered by our proprietary AI algorithms.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-500 text-sm md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-xl shadow-indigo-500/25 shadow-xl border-0 font-bold"
                  onClick={() => navigate('/login')}
                >
                  Analyze Invoice Now
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Button>

                {/* Updated View Demo Button */}
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowDemoModal(true)}
                  className="bg-transparent border-slate-700 text-white hover:bg-slate-800 text-sm md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold"
                >
                  <PlayCircle className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  View Demo
                </Button>
              </div>

              <div className="pt-8 flex items-center gap-6 text-slate-400 text-sm font-semibold">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No hidden fees</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Non-dilutive</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24 Hour Funding</span>
              </div>
            </motion.div>

            {/* Hero Visual - Split Screen Transformation */}
            <motion.div
              style={{ y: y1 }}
              className="w-full lg:w-1/2 relative mt-4 mb-16 lg:mt-0 lg:mb-0"
            >
              <div className="relative w-full max-w-[600px] aspect-square lg:aspect-[4/3] mx-auto">
                {/* Back Card (PDF Invoice) */}
                <motion.div
                  initial={{ rotate: -6, x: -20, opacity: 0 }}
                  animate={{ rotate: -3, x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="absolute top-0 left-4 right-4 lg:left-8 lg:right-8 bottom-8 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 opacity-60 scale-95 origin-bottom-right"
                >
                  <div className="flex items-center justify-between mb-8 opacity-50">
                    <div className="w-20 h-6 bg-slate-600 rounded" />
                    <div className="w-12 h-12 bg-slate-600 rounded-full" />
                  </div>
                  <div className="space-y-4 opacity-50">
                    <div className="w-full h-4 bg-slate-600 rounded" />
                    <div className="w-2/3 h-4 bg-slate-600 rounded" />
                    <div className="w-full h-32 bg-slate-600/50 rounded mt-8" />
                  </div>
                </motion.div>

                {/* Front Card (Success UI) */}
                <motion.div
                  initial={{ rotate: 6, y: 40, opacity: 0 }}
                  animate={{ rotate: 0, y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute top-8 left-0 right-0 lg:right-8 bottom-0 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-[0_0_50px_rgba(79,70,229,0.15)] p-4 lg:p-6 flex flex-col"
                >
                  {/* Header of Card */}
                  <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm sm:text-base">Invoice Approved</h3>
                        <p className="text-slate-400 text-xs font-medium">ID: #INV-2024-001</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-bold border border-emerald-500/20 whitespace-nowrap">
                      FUNDING READY
                    </span>
                  </div>

                  {/* Main Stat */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-800/50 p-3 sm:p-4 rounded-xl border border-slate-700/50">
                      <p className="text-slate-400 text-xs font-bold mb-1">Approved Amount</p>
                      <p className="text-xl sm:text-2xl font-bold text-white">₹50,00,000</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 sm:p-4 rounded-xl border border-slate-700/50">
                      <p className="text-slate-400 text-xs font-bold mb-1">Interest Rate</p>
                      <p className="text-xl sm:text-2xl font-bold text-indigo-400">1.2% <span className="text-sm font-normal text-slate-500">/mo</span></p>
                    </div>
                  </div>

                  {/* Live Demo Component: Trend Chart */}
                  <div className="flex-1 bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 overflow-hidden relative">
                    <p className="text-xs font-bold text-slate-400 mb-2 absolute top-4 left-4 z-10">Risk Analysis Trend</p>
                    <div className="w-full h-full pt-4">
                      <RiskTrendChart data={riskTrendData} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* STATS / SOCIAL PROOF */}
      <section className="py-10 bg-slate-950 border-y border-slate-800 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-500 text-sm font-bold mb-6 uppercase tracking-widest">Trusted by next-gen finance teams</p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Dummy Logos */}
            <span className="text-xl font-bold text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rounded-full" /> Acme Corp</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rounded-tr-xl" /> GlobalTech</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rotate-45" /> Nexus</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rounded-sm" /> Stripe</span>
            <span className="text-xl font-bold text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rounded-full border-2 border-slate-950" /> Mercury</span>
          </div>
        </div>
      </section>

      {/* FEATURES GRID (DARK MODE) */}
      <section id="features" className="py-24 bg-[#0B0F19] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">Complete Financial Intelligence</h2>
            <p className="text-slate-400 text-lg font-medium">We don't just lend money. We provide a complete operating system for your accounts receivable.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:-translate-y-2 transition-transform duration-300 border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl hover:border-indigo-500/30 group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-3">AI Risk Scoring</h3>
              <p className="text-slate-500 leading-relaxed mb-4 font-medium">
                Our proprietary engine analyzes 20+ data points to generate a real-time grade calculation for every invoice.
              </p>
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm cursor-pointer group-hover:text-indigo-900">
                Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            <Card className="hover:-translate-y-2 transition-transform duration-300 border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl hover:border-rose-500/30 group">
              <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rose-500/20 transition-colors">
                <ShieldCheck className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-3">Fraud Detection</h3>
              <p className="text-slate-500 leading-relaxed mb-4 font-medium">
                Automated security checks detect duplicate invoices, future-dated fraud, and platform limit breaches instantly.
              </p>
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm cursor-pointer group-hover:text-rose-900">
                View Security Docs <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            <Card className="hover:-translate-y-2 transition-transform duration-300 border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl hover:border-amber-500/30 group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-3">Instant Funding</h3>
              <p className="text-slate-500 leading-relaxed mb-4 font-medium">
                Access up to 80% LTV financing within seconds of approval. No paperwork, just instant capital deployment.
              </p>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm cursor-pointer group-hover:text-amber-900">
                See Rates <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-slate-950 relative overflow-hidden z-10">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-4">How It Works</h2>
              <p className="text-slate-400 text-lg font-medium max-w-xl">A seamless 3-step pipeline from upload to cash in your bank account.</p>
            </div>
            <Button variant="secondary" className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 font-bold">Read API Documentation</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-400" />

            {/* Step 1 */}
            <div className="relative pt-8 group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-4 border-indigo-500 z-10 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              <div className="bg-white backdrop-blur-md rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                <div className="bg-slate-800 w-12 h-12 rounded-lg shadow-inner flex items-center justify-center mb-4 border border-slate-700">
                  <FileText className="w-6 h-6 text-slate-300 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-indigo-900 mb-2">1. Upload & Validate</h3>
                <p className="text-sm font-medium text-slate-500">Drag & drop PDF invoices. Our system instantly verifies dates, amounts, and GST compliance via OCR.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative pt-8 group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-4 border-indigo-500 z-10 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              <div className="bg-white backdrop-blur-md rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                <div className="bg-slate-800 w-12 h-12 rounded-lg shadow-inner flex items-center justify-center mb-4 border border-slate-700">
                  <Lock className="w-6 h-6 text-slate-300 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-indigo-900 mb-2">2. AI Risk Assessment</h3>
                <p className="text-sm font-medium text-slate-500">Our engine analyzes 20+ data points—business age, revenue exposure—to generate a real-time Credit Score.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative pt-8 group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-4 border-indigo-500 z-10 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              <div className="bg-white backdrop-blur-md rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                <div className="bg-slate-800 w-12 h-12 rounded-lg shadow-inner flex items-center justify-center mb-4 border border-slate-700">
                  <Zap className="w-6 h-6 text-slate-300 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-indigo-900 mb-2">3. Instant Financing</h3>
                <p className="text-sm font-medium text-slate-500">Receive an immediate 'Approved' decision with transparent fee structures and funding limits. All at one place.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SPOTLIGHT / LIVE DEMO */}
      <section className="pt-24 pb-24 bg-[#0B0F19] relative overflow-hidden z-10">
        {/* Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Left Text */}
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-extrabold text-white mb-6">Live Analytics Dashboard</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-indigo-400 mb-2">Dynamic Scoring</h3>
                  <p className="text-slate-400 text-sm font-medium">Fair interest rates based on actual business performance (Grade A, B, C), not just generic bank rules.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-400 mb-2">Fraud Guard</h3>
                  <p className="text-slate-400 text-sm font-medium">Automatic detection of duplicate invoices and platform limit breaches to keep your capital safe.</p>
                </div>
                <Button variant="primary" className="mt-4 bg-indigo-600 border-none font-bold">
                  Explore Dashboard
                </Button>
              </div>
            </div>

            {/* Right Live Components Grid */}
            <div className="lg:w-2/3 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">

                {/* Card 1: Gauge */}
                <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-slate-50/10 opacity-100 z-0" />
                  <div className="relative z-10">
                    <h4 className="font-bold text-slate-800 mb-4">Credit Health</h4>
                    <CreditScoreGauge score={gaugeScore} grade="A" loading={false} />
                  </div>
                </div>

                {/* Card 2: Stat Card & Fraud Box */}
                <div className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-lg h-[140px]">
                    <StatCard
                      title="Total Processed"
                      value="₹50L Processed"
                      icon={Zap}
                      trend="up"
                      trendValue="12.5%"
                      trendLabel="vs last month"
                    />
                  </div>

                  <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-lg">
                    <FraudAlertBox fraudCheck={fraudCheckData} />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TECHNICAL INFRASTRUCTURE (CARDS) */}
      <section className="py-20 bg-slate-950 relative z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">Core Infrastructure</h2>
            <p className="text-slate-400">Powered by enterprise-grade banking protocols.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: Risk Engine */}
            <Card className="bg-slate-900/50 border-slate-800 p-6 hover:border-indigo-500/30 transition-all group">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform delay-75">
                  <Database className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-2">Risk Engine</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Analyzes 20+ data points including exposure ratios and payment history.
              </p>
            </Card>

            {/* Card 2: Bank Integration */}
            <Card className="bg-slate-900/50 border-slate-800 p-6 hover:border-emerald-500/30 transition-all group">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform delay-75">
                  <Webhook className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Bank Integration</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Simulated payment gateway logic with robust error handling.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 relative z-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
              <span className="font-bold text-lg">C</span>
            </div>
            <span className="text-lg font-bold text-slate-400">CredFlow</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>

          <p className="text-slate-600 text-xs font-medium">© 2026 CredFlow Inc. All rights reserved.</p>
        </div>
      </footer>

      {/* DEMO ACCESS MODAL */}
      <Modal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        title={null}
        className="
    bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950
    border border-slate-700/60 text-white
    rounded-xl
    w-[92%] max-w-md
    max-h-[85vh] overflow-y-auto
  "
      >
        <div className="space-y-4 px-4 sm:px-5 py-4 sm:py-5">

          {/* Header */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 flex items-center justify-center ring-1 ring-indigo-500/30 shrink-0">
              <span className="text-indigo-400 text-xs font-bold">⚡</span>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-100">
                Access Demo Account
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Skip signup and explore the platform
              </p>
            </div>
          </div>

          {/* Info Banner — UPDATED */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg">
            <p className="text-indigo-300 text-[11px] sm:text-xs leading-relaxed">
              Want to skip the signup and business profile setup?
              Use the demo credentials below to log in and explore the application flow.
            </p>
          </div>

          {/* Credentials */}
          <div className="space-y-3">
            <div>
              <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">
                Demo Email
              </label>
              <div className="mt-1.5 flex items-center justify-between bg-slate-950/80 px-3 py-2.5 rounded-lg border border-slate-800">
                <code className="text-emerald-400 font-mono text-[11px] sm:text-xs">
                  demo@credflow.com
                </code>
                <span className="hidden sm:block text-[10px] text-slate-500">
                  Login
                </span>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">
                Demo Password
              </label>
              <div className="mt-1.5 flex items-center justify-between bg-slate-950/80 px-3 py-2.5 rounded-lg border border-slate-800">
                <code className="text-emerald-400 font-mono text-[11px] sm:text-xs">
                  password123
                </code>
                <span className="hidden sm:block text-[10px] text-slate-500">
                  Temporary
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2 space-y-2">
            <Button
              variant="primary"
              className="
          w-full py-2 sm:py-2.5
          text-xs sm:text-sm font-semibold
          rounded-lg
          bg-gradient-to-r from-indigo-600 to-violet-600
          hover:from-indigo-500 hover:to-violet-500
          shadow-md shadow-indigo-600/20
        "
              onClick={() => navigate('/login')}
            >
              Go to Login Page →
            </Button>

            <p className="text-center text-[10px] text-slate-500">
              No signup required • Limited demo access
            </p>
          </div>

        </div>
      </Modal>

    </div>
  );
};

export default LandingPage;