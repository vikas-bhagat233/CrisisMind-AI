import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { CRISIS_EXAMPLES } from "../../utils/constants";

const CRISIS_TAGS = [
  { icon: "🌊", label: "Flood" },
  { icon: "🌍", label: "Earthquake" },
  { icon: "🔥", label: "Wildfire" },
  { icon: "🌪", label: "Cyclone" },
  { icon: "🦠", label: "Outbreak" },
  { icon: "⚡", label: "Power outage" },
  { icon: "💻", label: "Cyberattack" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const go = (q?: string) => {
    const value = (q ?? query).trim();
    if (!value) return;
    navigate("/analyze", { state: { query: value } });
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice typing is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setQuery(speechToText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <MainLayout>
      <section className="pt-6 pb-16">
        <p className="eyebrow mb-4">AI-powered crisis intelligence & decision support</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink max-w-3xl leading-tight">
          One line in. A full response plan out.
        </h1>
        <p className="text-ink-muted mt-4 max-w-xl text-lg">
          Describe what's happening — a flood, an earthquake, a ransomware attack — and a
          crew of AI agents researches it, scores the risk, and drafts your action plan
          and messages, live.
        </p>

        <div className="mt-8 max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && go()}
                placeholder="e.g. There is a flood in Mumbai. What should I do?"
                className="sm:text-base pr-10"
              />
              <button
                type="button"
                onClick={startVoiceInput}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg hover:opacity-80 transition-opacity ${
                  isListening ? "animate-pulse text-red-500" : "text-ink-muted"
                }`}
                title="Voice Search"
              >
                🎙️
              </button>
            </div>
            <Button onClick={() => go()} className="sm:w-40">
              Analyze
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {CRISIS_EXAMPLES.slice(0, 3).map((ex) => (
              <button
                key={ex}
                onClick={() => go(ex)}
                className="text-xs text-ink-muted border border-base-600 rounded-full px-3 py-1.5 hover:text-ink hover:border-signal/60 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-10">
          {CRISIS_TAGS.map((tag) => (
            <span
              key={tag.label}
              className="flex items-center gap-1.5 text-sm text-ink-muted bg-base-800 border border-base-600/60 rounded-full px-3 py-1.5"
            >
              <span>{tag.icon}</span>
              {tag.label}
            </span>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          {
            title: "Seven agents, one pipeline",
            body: "Planner, Research, Risk, Response, Communication, Summary and Validator hand off work in sequence — visibly, not as a black box.",
          },
          {
            title: "Live grounding, not guesses",
            body: "Research pulls current advisories and weather where possible, so the plan reflects the actual situation, not a template.",
          },
          {
            title: "Ready-to-send messages",
            body: "Get a drafted SMS and email so you can tell people you're safe without composing anything under stress.",
          },
        ].map((f) => (
          <div key={f.title} className="panel p-5">
            <p className="font-display font-semibold text-ink mb-2">{f.title}</p>
            <p className="text-sm text-ink-muted">{f.body}</p>
          </div>
        ))}
      </section>
    </MainLayout>
  );
}
