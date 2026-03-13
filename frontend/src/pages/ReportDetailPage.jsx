import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { database, dbRef, get } from '../services/firebaseClient';
import { SkeletonCard } from '../components/Skeleton';
import DownloadSummaryButton from '../components/DownloadSummaryButton';
import { chatAboutReportApi } from '../services/api';
import {
  FileText,
  Calendar,
  BadgeCheck,
  Share2,
  Sparkles,
  Shield,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  AlertTriangle,
  HeartPulse,
  Stethoscope,
  Salad,
  Activity,
  TrendingUp,
  X,
  Send,
} from 'lucide-react';
import MetricsChart from '../components/MetricsChart';
import RiskTrendChart from '../components/RiskTrendChart';

const ReportDetailPage = () => {
  const { reportId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !reportId) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const reportRef = dbRef(database, `users/${user.uid}/reports/${reportId}`);
        const snapshot = await get(reportRef);
        
        if (snapshot.exists()) {
          setReport({ id: reportId, ...snapshot.val() });
        } else {
          setError('Report not found or you do not have permission to view it.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch report details.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user, reportId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  // const analysis = report?.analysis || null;
  const analysis = {
  ...(report?.analysis || {}),
  summary: report?.summary,
  riskScore: report?.riskScore,
  riskLevel: report?.riskLevel,
  extractedText: report?.extractedText
};

  const fileMeta = useMemo(() => {
    const fileName = report?.fileName || 'Medical Report';
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    const type =
      ext === 'pdf'
        ? 'PDF'
        : ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)
        ? 'Image'
        : ext
        ? ext.toUpperCase()
        : 'File';
    return { fileName, ext, type };
  }, [report?.fileName]);

  const createdAtText = useMemo(() => {
    const ts = report?.createdAt;
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return '—';
    }
  }, [report?.createdAt]);

  const riskScore = analysis?.riskScore ?? null;
  const riskLevel = analysis?.riskLevel || '—';
  const healthScore = useMemo(() => {
    if (riskScore == null || Number.isNaN(Number(riskScore))) return null;
    const v = 100 - Math.max(0, Math.min(100, Number(riskScore)));
    return Math.round(v);
  }, [riskScore]);

  const scoreTone = useMemo(() => {
    const v = healthScore ?? 0;
    if (v >= 70) return 'good';
    if (v >= 40) return 'moderate';
    return 'risk';
  }, [healthScore]);

  const scoreColors = useMemo(() => {
    if (scoreTone === 'good')
      return { ring: '#22c55e', glow: 'rgba(34,197,94,0.25)', label: 'Good' };
    if (scoreTone === 'moderate')
      return { ring: '#f59e0b', glow: 'rgba(245,158,11,0.22)', label: 'Moderate' };
    return { ring: '#ef4444', glow: 'rgba(239,68,68,0.20)', label: 'At risk' };
  }, [scoreTone]);

  const confidencePct = useMemo(() => {
    const used = Boolean(analysis?.aiMeta?.used);
    const mode = analysis?.aiMeta?.mode;
    if (!analysis) return 0;
    if (!used) return 62;
    if (mode === 'structured') return 86;
    return 76;
  }, [analysis]);

  const onShare = async () => {
    if (!analysis) return;
    const text =
      `AI Medical Report Analysis\n\n` +
      `Report: ${fileMeta.fileName}\n` +
      `Uploaded: ${createdAtText}\n` +
      `Risk: ${analysis.riskLevel || 'N/A'} (${analysis.riskScore ?? 'N/A'}/100)\n\n` +
      `Summary:\n${analysis.summary || 'No summary available'}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
      alert('Could not copy summary automatically.');
    }
  };

  const onAskAi = () => setChatOpen(true);

  const onSendChat = async (e) => {
    e.preventDefault();
    if (!question.trim() || !analysis) return;
    const q = question.trim();
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setChatLoading(true);
    try {
      const res = await chatAboutReportApi(q, analysis);
      setMessages((prev) => [...prev, { role: 'ai', text: res.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Sorry, something went wrong while generating an answer.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4 fade-in">
        <div className="row g-4">
          <div className="col-12 col-xl-8">
            <SkeletonCard />
          </div>
          <div className="col-12 col-xl-4">
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container py-5 fade-in">
        <div className="card-modern p-5 text-center bg-white border-0 shadow-lg">
          <div className="mb-4 d-flex justify-content-center">
             <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center" style={{width: 80, height: 80}}>
                 <i className="bi bi-exclamation-triangle-fill fs-1"></i>
             </div>
          </div>
          <h3 className="fw-bold mb-3">{error || 'Report not found'}</h3>
          <p className="text-muted mb-4">The report you are looking for might have been deleted or never existed.</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-primary btn-glow rounded-pill px-4 py-2"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#f8fafc 0%,#eef2ff 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back + breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            onClick={() => navigate('/reports')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-gray-200 text-gray-700 hover:bg-white transition-all shadow-sm"
          >
            <i className="bi bi-arrow-left" />
            Back to Reports
          </button>
          {copied && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
              <BadgeCheck className="w-4 h-4" />
              Copied to clipboard
            </div>
          )}
        </div>

        {/* Report Header */}
        <ReportHeader
          fileName={fileMeta.fileName}
          uploadDate={createdAtText}
          fileType={fileMeta.type}
          onShare={onShare}
          onAskAi={onAskAi}
          analysis={analysis}
        />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            <HealthScoreCard
              healthScore={healthScore}
              riskLevel={riskLevel}
              summary={analysis?.summary}
              confidencePct={confidencePct}
              ringColor={scoreColors.ring}
              glowColor={scoreColors.glow}
              scoreLabel={scoreColors.label}
            />

            <InsightsGrid analysis={analysis} reports={[report]} />

            <OCRSection extractedText={analysis?.extractedText} open={ocrOpen} setOpen={setOcrOpen} />
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            <PatientInfoCard
              patient={analysis?.patient}
              reportDate={analysis?.date || createdAtText}
              reportType={analysis?.reportType || fileMeta.type}
              riskLevel={riskLevel}
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900 m-0">Privacy</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 m-0 leading-relaxed">
                Your report is stored in your private account. This dashboard provides educational insights and is not a medical diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Ask AI button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold shadow-2xl transition-transform"
        style={{
          background: 'linear-gradient(90deg,#2563eb,#16a34a)',
        }}
      >
        <Sparkles className="w-5 h-5" />
        Ask AI
      </button>

      {/* Chat Assistant panel */}
      {chatOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setChatOpen(false)}
          />
          <div className="absolute bottom-0 right-0 w-full sm:w-[420px] h-[70vh] sm:h-[640px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-100 m-0 sm:m-6 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#16a34a)' }}
                >
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 leading-tight">AI Assistant</div>
                  <div className="text-xs text-gray-500">Ask about your results and next steps</div>
                </div>
              </div>
              <button
                className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {!analysis && (
              <div className="p-5 text-center text-sm text-gray-600">
                Analyze a report first to enable AI chat.
              </div>
            )}

            <div className="flex-1 overflow-auto p-5 space-y-4">
              {messages.length === 0 ? (
                <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="text-sm text-indigo-900">
                      <div className="font-semibold mb-1">Try asking:</div>
                      <ul className="m-0 ps-4 space-y-1 text-indigo-800/80">
                        <li>What do my results mean?</li>
                        <li>Should I be worried about anything?</li>
                        <li>What changes should I make this week?</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        m.role === 'user'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-800 border border-gray-100'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))
              )}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-gray-50 text-gray-600 border border-gray-100">
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100">
              <form onSubmit={onSendChat} className="flex items-center gap-2">
                <input
                  className="form-control border-0 bg-gray-50 rounded-2xl px-4 py-3"
                  style={{ boxShadow: 'none' }}
                  disabled={!analysis || chatLoading}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={analysis ? 'Ask something about your report…' : 'Select a report to enable chat'}
                />
                <button
                  type="submit"
                  disabled={!analysis || chatLoading || !question.trim()}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-white shadow-lg disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#16a34a)' }}
                  aria-label="Send"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetailPage;

function ReportHeader({ fileName, uploadDate, fileType, onShare, onAskAi, analysis }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-700 bg-indigo-50 border border-indigo-100"
            title={fileType}
          >
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {uploadDate}
              </span>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                {fileType}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 truncate">
              {fileName}
            </h1>
            <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                {analysis?.aiMeta?.used ? `AI: ${analysis.aiMeta.provider}` : 'AI: fallback'}
              </span>
              {analysis?.aiMeta?.used === false && analysis?.aiMeta?.error ? (
                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {analysis.aiMeta.error}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <DownloadSummaryButton analysis={analysis} />
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-full font-medium transition-all duration-200 border border-gray-200 shadow-sm text-sm"
          >
            <Share2 className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline-block">Share</span>
          </button>
          <button
            onClick={onAskAi}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-full font-semibold shadow-lg text-sm"
            style={{ background: 'linear-gradient(90deg,#2563eb,#16a34a)' }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function HealthScoreCard({ healthScore, riskLevel, summary, confidencePct, ringColor, glowColor, scoreLabel }) {
  const value = healthScore ?? 0;
  const deg = Math.max(0, Math.min(100, value)) * 3.6;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(${ringColor} ${deg}deg, #e5e7eb 0deg)`,
              boxShadow: `0 22px 50px ${glowColor}`,
            }}
          >
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 leading-none">{healthScore ?? '—'}</div>
                <div className="text-xs text-gray-500 mt-1">/ 100</div>
              </div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <HeartPulse className="w-4 h-4" style={{ color: ringColor }} />
              <span className="font-semibold">{scoreLabel}</span>
              <span className="text-gray-300">•</span>
              <span className="font-medium">Risk: {riskLevel}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-2">Health Score</h2>
            <div className="text-sm text-gray-600 mt-1">
              Confidence: <span className="font-semibold text-gray-900">{confidencePct}%</span>
            </div>
          </div>
        </div>

        <div className="flex-1 md:max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <div className="font-semibold text-gray-900">AI quick summary</div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed m-0">
            {summary || 'No summary available for this report.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function InsightsGrid({ analysis, reports }) {
  const conditions = analysis?.conditions || [];
  const diet = analysis?.dietAndLifestyle || [];
  const rec = analysis?.doctorRecommendation || '';

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900 m-0">Medical Insights</h2>
        <div className="text-xs text-gray-500">Premium dashboard view</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard icon={<Sparkles className="w-5 h-5 text-indigo-600" />} title="AI Summary">
          <p className="text-sm text-gray-600 leading-relaxed m-0">
            {analysis?.summary || 'No summary available.'}
          </p>
        </InsightCard>

        <InsightCard icon={<AlertTriangle className="w-5 h-5 text-amber-600" />} title="Detected Conditions">
          {conditions.length ? (
            <ul className="m-0 ps-4 space-y-1 text-sm text-gray-700">
              {conditions.slice(0, 6).map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-600">No significant conditions detected.</div>
          )}
        </InsightCard>

        <InsightCard icon={<Stethoscope className="w-5 h-5 text-rose-600" />} title="Doctor Recommendations">
          <p className="text-sm text-gray-600 leading-relaxed m-0">
            {rec || 'No recommendations provided. Please consult your clinician for personalized advice.'}
          </p>
        </InsightCard>

        <InsightCard icon={<Salad className="w-5 h-5 text-emerald-600" />} title="Diet & Lifestyle Advice">
          {diet.length ? (
            <ul className="m-0 ps-4 space-y-1 text-sm text-gray-700">
              {diet.slice(0, 6).map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-600">No diet/lifestyle advice available.</div>
          )}
        </InsightCard>

        <InsightCard icon={<Activity className="w-5 h-5 text-cyan-600" />} title="Health Metrics Chart">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
            <MetricsChart metrics={analysis?.metrics || []} />
          </div>
        </InsightCard>

        <InsightCard icon={<TrendingUp className="w-5 h-5 text-teal-600" />} title="Risk Trend Chart">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
            <RiskTrendChart reports={reports || []} />
          </div>
        </InsightCard>
      </div>
    </div>
  );
}

function InsightCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          {icon}
        </div>
        <div className="font-semibold text-gray-900">{title}</div>
      </div>
      {children}
    </div>
  );
}

function PatientInfoCard({ patient, age, reportDate, reportType, riskLevel }) {
  const name = patient?.name || '—';
  const pAge = patient?.age || age || '—';
  const gender = patient?.sex || '—';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-gray-900 m-0">Patient Information</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-600">
          {riskLevel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <InfoRow icon={<UserIcon className="w-4 h-4 text-gray-500" />} label="Name" value={name} />
        <InfoRow icon={<BadgeCheck className="w-4 h-4 text-gray-500" />} label="Age" value={pAge} />
        <InfoRow icon={<Shield className="w-4 h-4 text-gray-500" />} label="Gender" value={gender} />
        <InfoRow icon={<Calendar className="w-4 h-4 text-gray-500" />} label="Report Date" value={reportDate || '—'} />
        <InfoRow icon={<FileText className="w-4 h-4 text-gray-500" />} label="Report Type" value={reportType || '—'} />
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-semibold text-gray-900 truncate">{value}</div>
      </div>
    </div>
  );
}

function OCRSection({ extractedText, open, setOpen }) {
  const hasText = Boolean(extractedText && extractedText.trim());
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900">Extracted Report Text</div>
            <div className="text-xs text-gray-500">
              {hasText ? 'OCR text captured from your upload' : 'No OCR text available'}
            </div>
          </div>
        </div>
        <div className="text-gray-500">{open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
      </button>

      {open && (
        <div className="px-6 pb-6">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 max-h-[320px] overflow-auto text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {hasText ? extractedText : 'No extracted text for this report.'}
          </div>
        </div>
      )}
    </div>
  );
}
