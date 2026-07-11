import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ReportSection from "../../components/reports/ReportSection";
import RiskBadge from "../../components/reports/RiskBadge";
import ActionChecklist from "../../components/reports/ActionChecklist";
import ExportPDF from "../../components/reports/ExportPDF";
import RiskChart from "../../components/charts/RiskChart";
import ProgressTimeline from "../../components/agents/ProgressTimeline";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import CrisisMap from "../../components/maps/CrisisMap";
import WeatherWidget from "../../components/reports/WeatherWidget";
import { getReport, translateReport } from "../../services/api";
import type { CrisisReport } from "../../types";
import { formatCrisisType, formatDate } from "../../utils/formatter";

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const [originalReport, setOriginalReport] = useState<CrisisReport | null>(null);
  const [currentReport, setCurrentReport] = useState<CrisisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Translation State
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [translating, setTranslating] = useState(false);

  // Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!id) return;
    getReport(id)
      .then((rep) => {
        setOriginalReport(rep);
        setCurrentReport(rep);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [id]);

  if (loading) return <MainLayout><Loader label="Loading report" /></MainLayout>;
  if (notFound || !currentReport) {
    return (
      <MainLayout>
        <EmptyState title="Report not found" description="This report may have expired or the link is incorrect." />
      </MainLayout>
    );
  }

  // Language Change handler
  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    if (lang === "English") {
      setCurrentReport(originalReport);
      setSelectedLanguage("English");
      return;
    }
    if (!id) return;
    setTranslating(true);
    try {
      const translated = await translateReport(id, lang);
      setCurrentReport(translated);
      setSelectedLanguage(lang);
    } catch (err) {
      console.error("Translation failed", err);
    } finally {
      setTranslating(false);
    }
  };

  // TTS Briefing handler
  const toggleBriefing = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!currentReport) return;

      let langCode = "en-US";
      let intro = "Crisis situation report briefing.";
      let crisisLabel = "Crisis type";
      let locationLabel = "in";
      let summaryLabel = "Situation summary";
      let actionsLabel = "Immediate actions required are";

      if (selectedLanguage === "Spanish") {
        langCode = "es-ES";
        intro = "Información del informe de situación de crisis.";
        crisisLabel = "Tipo de crisis";
        locationLabel = "en";
        summaryLabel = "Resumen de la situación";
        actionsLabel = "Las acciones inmediatas requeridas son";
      } else if (selectedLanguage === "French") {
        langCode = "fr-FR";
        intro = "Briefing du rapport de situation de crise.";
        crisisLabel = "Type de crise";
        locationLabel = "à";
        summaryLabel = "Résumé de la situation";
        actionsLabel = "Les actions immédiates requises sont";
      } else if (selectedLanguage === "Hindi") {
        langCode = "hi-IN";
        intro = "संकट स्थिति रिपोर्ट ब्रीफिंग।";
        crisisLabel = "संकट का प्रकार";
        locationLabel = "स्थान";
        summaryLabel = "स्थिति का सारांश";
        actionsLabel = "तत्काल आवश्यक कार्रवाई हैं";
      } else if (selectedLanguage === "Chinese") {
        langCode = "zh-CN";
        intro = "危机状况报告简报。";
        crisisLabel = "危机类型";
        locationLabel = "在";
        summaryLabel = "情况总结";
        actionsLabel = "需要立即采取的行动是";
      }

      const textToSpeak = `
        ${intro}
        ${crisisLabel}: ${currentReport.crisis_type} ${locationLabel} ${currentReport.location}.
        ${summaryLabel}: ${currentReport.situation_summary}.
        ${actionsLabel}:
        ${currentReport.action_plan.slice(0, 3).join(". ")}.
      `;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;

      // Try to find matching voice on the local system
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang.startsWith(langCode.split("-")[0]));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Export handlers
  const exportMarkdown = () => {
    const md = `# Crisis Report: ${currentReport.crisis_type.toUpperCase()} in ${currentReport.location}
Date: ${formatDate(currentReport.created_at)}
Query: ${currentReport.query}

## Situation Summary
${currentReport.situation_summary}

## Risk Assessment
- Level: ${currentReport.risk.level}
- Score: ${currentReport.risk.score}/100
- Reasons:
${currentReport.risk.reasons.map((r) => `  - ${r}`).join("\n")}

## Immediate Actions
${currentReport.action_plan.map((a) => `- [ ] ${a}`).join("\n")}

## Emergency Preparedness Checklist
${currentReport.emergency_checklist.map((e) => `- [ ] ${e}`).join("\n")}

## Communication drafts
### SMS
${currentReport.communication.sms}

### Email
Subject: ${currentReport.communication.email_subject}
Body:
${currentReport.communication.email_body}

## Research Findings
${currentReport.research_findings.map((f) => `- ${f}`).join("\n")}

## Sources
${currentReport.sources.map((s) => `- ${s}`).join("\n")}
`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crisismind-report-${currentReport.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(currentReport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crisismind-report-${currentReport.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportOfflineHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline Crisis Report - ${currentReport.location}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #090d16; color: #e2e8f0; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { color: #ffffff; border-bottom: 1px solid #1e293b; padding-bottom: 8px; }
    .badge { background: #e11d48; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; font-weight: bold; }
    .checklist-item { display: flex; align-items: start; margin-bottom: 10px; font-size: 0.95rem; }
    .checklist-item input { margin-right: 12px; margin-top: 5px; transform: scale(1.1); }
    .card { background: #111827; border: 1px solid #1f2937; padding: 20px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
    @media(min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
  </style>
</head>
<body>
  <h1>Crisis Response Kit: ${currentReport.crisis_type.toUpperCase()} in ${currentReport.location}</h1>
  <p><strong>Generated on:</strong> ${new Date(currentReport.created_at || "").toLocaleString()}</p>
  
  <div class="card">
    <h2>Situation Summary</h2>
    <p>${currentReport.situation_summary}</p>
  </div>
  
  <div class="grid">
    <div class="card">
      <h2>Risk Profile: <span class="badge">${currentReport.risk.level} (${currentReport.risk.score}/100)</span></h2>
      <ul>
        ${currentReport.risk.reasons.map((r) => `<li>${r}</li>`).join("")}
      </ul>
    </div>
    
    <div class="card">
      <h2>Research & Sources</h2>
      <ul>
        ${currentReport.research_findings.map((f) => `<li>${f}</li>`).join("")}
      </ul>
    </div>
  </div>

  <div class="card">
    <h2>Immediate Action Steps</h2>
    ${currentReport.action_plan.map((a) => `
      <div class="checklist-item">
        <input type="checkbox">
        <span>${a}</span>
      </div>
    `).join("")}
  </div>

  <div class="card">
    <h2>Family & Preparedness Checklist</h2>
    ${currentReport.emergency_checklist.map((e) => `
      <div class="checklist-item">
        <input type="checkbox">
        <span>${e}</span>
      </div>
    `).join("")}
  </div>

  <div class="card">
    <h2>Emergency Broadcast Drafts</h2>
    <h3>SMS Broadcast</h3>
    <p style="background: #1f2937; padding: 12px; border-radius: 6px; font-family: monospace;">${currentReport.communication.sms}</p>
    <h3>Email Broadcast</h3>
    <p><strong>Subject:</strong> ${currentReport.communication.email_subject}</p>
    <p style="background: #1f2937; padding: 12px; border-radius: 6px; white-space: pre-wrap; font-family: monospace;">${currentReport.communication.email_body}</p>
  </div>
</body>
</html>
`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crisismind-offline-kit-${currentReport.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-1">{formatDate(currentReport.created_at)}</p>
          <h1 className="font-display text-3xl font-semibold text-ink capitalize">
            {formatCrisisType(currentReport.crisis_type)} · {currentReport.location}
          </h1>
        </div>

        {/* Action Controls Panel */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Audio briefing */}
          <Button variant="ghost" onClick={toggleBriefing} className="h-10 text-xs">
            {isSpeaking ? "⏹️ Stop Briefing" : "🔊 Listen Briefing"}
          </Button>

          {/* Translation selector */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              disabled={translating}
              className="h-10 bg-base-800 border border-base-600 rounded-lg px-3 py-1 text-xs text-ink focus:outline-none focus:border-signal cursor-pointer disabled:opacity-50"
            >
              <option value="English">🇬🇧 English</option>
              <option value="Spanish">🇪🇸 Spanish</option>
              <option value="French">🇫🇷 French</option>
              <option value="Hindi">🇮🇳 Hindi</option>
              <option value="Chinese">🇨🇳 Chinese</option>
            </select>
          </div>

          {/* Export tools */}
          {currentReport.id && <ExportPDF reportId={currentReport.id} />}
          
          <div className="flex rounded-lg border border-base-600 overflow-hidden">
            <button
              onClick={exportMarkdown}
              title="Export Markdown"
              className="h-10 px-3 text-xs bg-base-800 hover:bg-base-700 text-ink border-r border-base-600 transition-colors"
            >
              MD
            </button>
            <button
              onClick={exportJson}
              title="Export JSON"
              className="h-10 px-3 text-xs bg-base-800 hover:bg-base-700 text-ink border-r border-base-600 transition-colors"
            >
              JSON
            </button>
            <button
              onClick={exportOfflineHtml}
              title="Download Offline HTML Kit"
              className="h-10 px-3 text-xs bg-base-800 hover:bg-base-700 text-ink transition-colors"
            >
              HTML Kit
            </button>
          </div>
        </div>
      </div>

      {translating && (
        <div className="mb-6 p-4 panel flex items-center gap-3 bg-signal/10 border-signal/30 text-signal">
          <Loader label="Translating report..." />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ReportSection title="Situation summary">
            <p className="text-sm text-ink leading-relaxed">{currentReport.situation_summary}</p>
          </ReportSection>

          <ReportSection title="Immediate actions">
            <ActionChecklist items={currentReport.action_plan} />
          </ReportSection>

          <ReportSection title="Emergency preparedness checklist">
            <ActionChecklist items={currentReport.emergency_checklist} />
          </ReportSection>

          <ReportSection title="Research findings">
            <ul className="space-y-2 text-sm text-ink-muted">
              {currentReport.research_findings.map((f, idx) => (
                <li key={idx}>• {f}</li>
              ))}
            </ul>
            {currentReport.sources.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {currentReport.sources.map((s) => {
                  const isValidUrl = s.startsWith("http://") || s.startsWith("https://") || (!s.includes(" ") && s.includes("."));
                  const href = isValidUrl
                    ? (s.startsWith("http://") || s.startsWith("https://") ? s : `https://${s}`)
                    : `https://www.google.com/search?q=${encodeURIComponent(s)}`;
                  return (
                    <a
                      key={s}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-signal hover:underline"
                    >
                      {s}
                    </a>
                  );
                })}
              </div>
            )}
          </ReportSection>

          <ReportSection title="Communication draft">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-mono uppercase text-ink-muted mb-1">SMS</p>
                <p className="text-sm text-ink bg-base-900 rounded-lg p-3 border border-base-600">
                  {currentReport.communication.sms}
                </p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase text-ink-muted mb-1">
                  Email · {currentReport.communication.email_subject}
                </p>
                <p className="text-sm text-ink bg-base-900 rounded-lg p-3 border border-base-600 whitespace-pre-line">
                  {currentReport.communication.email_body}
                </p>
              </div>
            </div>
          </ReportSection>
        </div>

        <div className="space-y-6">
          {/* Interactive Map */}
          {currentReport.geo && currentReport.geo.latitude && currentReport.geo.longitude && (
            <ReportSection title="Incident Location Map">
              <div className="mb-2 text-xs text-ink-muted flex items-center justify-between">
                <span>📍 Epicenter: {currentReport.geo.latitude.toFixed(4)}, {currentReport.geo.longitude.toFixed(4)}</span>
                <span className="text-emerald-500 font-semibold">🏠 3 Shelters nearby</span>
              </div>
              <CrisisMap
                lat={currentReport.geo.latitude}
                lng={currentReport.geo.longitude}
                label={`Reported ${currentReport.crisis_type} epicenter near ${currentReport.location}`}
                shelters={currentReport.shelters}
              />
            </ReportSection>
          )}

          {/* Weather Conditions */}
          {currentReport.weather && (
            <ReportSection title="Local Weather Conditions">
              <WeatherWidget weather={currentReport.weather} />
            </ReportSection>
          )}

          <ReportSection title="Risk assessment">
            <RiskChart level={currentReport.risk.level} score={currentReport.risk.score} />
            <div className="mt-4 flex justify-center">
              <RiskBadge level={currentReport.risk.level} score={currentReport.risk.score} />
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-ink-muted">
              {currentReport.risk.reasons.map((r, idx) => (
                <li key={idx}>• {r}</li>
              ))}
            </ul>
          </ReportSection>

          <ReportSection title="Timeline">
            <ProgressTimeline items={currentReport.timeline} />
          </ReportSection>
        </div>
      </div>
    </MainLayout>
  );
}

