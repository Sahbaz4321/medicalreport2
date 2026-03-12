import React from 'react';
import MetricsTable from './MetricsTable';
import MetricsChart from './MetricsChart';
import MetricsPieChart from './MetricsPieChart';
import RiskGauge from './RiskGauge';
import RiskTrendChart from './RiskTrendChart';
import VoiceExplanationButton from './VoiceExplanationButton';
import DownloadSummaryButton from './DownloadSummaryButton';
import PatientSummaryCard from './PatientSummaryCard';

const SectionHeader = ({ number, title, iconClass, colorClass }) => {
  // Map bootstrap colors to tailwind equivalents for the header
  const colorMap = {
    primary: 'blue',
    danger: 'red',
    info: 'cyan',
    warning: 'yellow',
    success: 'emerald',
    indigo: 'indigo',
    teal: 'teal',
    secondary: 'gray'
  };
  
  const c = colorMap[colorClass] || 'blue';
  
  return (
    <div className="flex items-center mb-6">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-${c}-500 text-white font-bold shadow-md shrink-0 mr-4 text-lg`}>
        {number}
      </div>
      <div className="flex items-center">
        <i className={`bi ${iconClass} text-${c}-500 text-2xl mr-3 hidden sm:block`}></i>
        <h2 className="text-xl font-bold text-gray-800 m-0">{title}</h2>
      </div>
    </div>
  );
};

const CardSection = ({ children, borderTopColor }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 border-t-4 border-t-${borderTopColor}-500 transition-shadow hover:shadow-md`}>
    {children}
  </div>
);

const AnalysisPanel = ({ analysis, reports }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center justify-center text-center h-full border border-gray-100">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <i className="bi bi-file-medical text-blue-500 text-5xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No Report Selected</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Upload a medical report to see AI-powered explanations, abnormal values, and health insights.
        </p>
      </div>
    );
  }

  const {
    summary,
    riskScore,
    riskLevel,
    dietAndLifestyle,
    doctorRecommendation,
    metrics,
    aiMeta,
    patient,
    reportType,
    date,
    findings,
    conditions,
  } = analysis;

  const aiBadge = aiMeta?.used
    ? `AI: ${aiMeta.provider}`
    : `AI: fallback`;
  const aiError = aiMeta?.used ? null : aiMeta?.error;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Top Header Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
              <i className="bi bi-clipboard2-pulse text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Report Overview</h1>
          </div>
          <div className="flex flex-wrap gap-2 items-center mt-1">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${aiMeta?.used ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
              <i className="bi bi-cpu"></i>
              {aiBadge}
            </span>
            {aiError && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                <i className="bi bi-exclamation-triangle"></i>
                {aiError}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-пол w-full sm:w-auto">
          <VoiceExplanationButton text={summary} />
          <DownloadSummaryButton analysis={analysis} />
        </div>
      </div>

      {/* 1. Patient Details */}
      <div className="mb-6">
        <PatientSummaryCard patient={patient} reportType={reportType} date={date} />
      </div>

      {/* 2. Risk Score */}
      <CardSection borderTopColor="red">
        <SectionHeader number="1" title="Risk Score" iconClass="bi-heart-pulse-fill" colorClass="danger" />
        <div className="flex justify-center py-4">
          <div className="w-full max-w-sm">
            <RiskGauge riskScore={riskScore} riskLevel={riskLevel} />
          </div>
        </div>
      </CardSection>

      {/* 3. AI Summary */}
      <CardSection borderTopColor="blue">
        <SectionHeader number="2" title="AI Summary" iconClass="bi-robot" colorClass="primary" />
        <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
          <p className="text-gray-700 text-base leading-relaxed m-0">
            {summary || 'No summary available.'}
          </p>
        </div>
      </CardSection>

      {/* 4. Medical Findings */}
      <CardSection borderTopColor="cyan">
        <SectionHeader number="3" title="Medical Findings" iconClass="bi-journal-medical" colorClass="info" />
        {(findings || []).length > 0 ? (
          <ul className="space-y-3 m-0 p-0 list-none">
            {findings.map((f, idx) => (
              <li key={idx} className="flex items-start">
                <i className="bi bi-check-circle-fill text-cyan-500 mt-0.5 mr-3 text-lg shrink-0"></i>
                <span className="text-gray-700">{f}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <i className="bi bi-clipboard-x text-5xl mb-3 block opacity-50"></i>
            <p className="m-0">No specific medical findings extracted from this report.</p>
          </div>
        )}
      </CardSection>

      {/* 5. Conditions */}
      <CardSection borderTopColor="yellow">
        <SectionHeader number="4" title="Conditions" iconClass="bi-exclamation-triangle-fill" colorClass="warning" />
        {(conditions || []).length > 0 ? (
          <div className="flex flex-col gap-3">
            {conditions.map((c, idx) => (
              <div key={idx} className="flex items-center p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                <i className="bi bi-exclamation-circle text-yellow-500 text-2xl mr-4 shrink-0"></i>
                <span className="text-gray-800 font-medium">{c}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <i className="bi bi-shield-check text-5xl text-green-500 opacity-50 mb-3 block"></i>
            <p className="m-0 text-green-600 font-medium">Great news! No significant conditions or problems identified.</p>
          </div>
        )}
      </CardSection>

      {/* 6. Health Parameters Chart Area */}
      <CardSection borderTopColor="emerald">
        <SectionHeader number="5" title="Health Parameters" iconClass="bi-activity" colorClass="success" />
        
        {/* We place these consecutively rather than in a complex grid */}
        <div className="flex flex-col gap-6 mt-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
             <MetricsTable metrics={metrics || []} />
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <MetricsChart metrics={metrics || []} />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
               <MetricsPieChart metrics={metrics || []} />
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
               <RiskTrendChart reports={reports || []} />
            </div>
          </div>
        </div>
      </CardSection>

      {/* 7. Recommendations */}
      <CardSection borderTopColor="indigo">
        <SectionHeader number="6" title="Doctor Recommendations" iconClass="bi-person-hearts" colorClass="indigo" />
        <div className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100 relative overflow-hidden">
          <i className="bi bi-quote absolute -top-4 -left-2 text-indigo-500/10 text-8xl"></i>
          <p className="text-gray-700 text-base leading-relaxed m-0 relative z-10 font-medium">
            {doctorRecommendation || 'No specific recommendations provided. Please consult your physician for personalized advice.'}
          </p>
        </div>
      </CardSection>

      {/* 8. Diet & Lifestyle */}
      <CardSection borderTopColor="teal">
        <SectionHeader number="7" title="Diet & Lifestyle" iconClass="bi-basket2-fill" colorClass="teal" />
        {(dietAndLifestyle || []).length > 0 ? (
          <ul className="space-y-4 m-0 p-0 list-none">
            {dietAndLifestyle.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 mr-4 mt-0.5">
                  <i className="bi bi-arrow-right-short text-xl"></i>
                </div>
                <span className="text-gray-700 leading-relaxed pt-1">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <i className="bi bi-cup-hot text-5xl opacity-50 mb-3 block"></i>
            <p className="m-0">No specific lifestyle recommendations found in this report.</p>
          </div>
        )}
      </CardSection>

    </div>
  );
};

export default AnalysisPanel;
