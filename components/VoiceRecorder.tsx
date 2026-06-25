"use client";

import { useEffect, useRef, useState } from "react";
import { Mic } from "./icons";

// Minimal typings for the Web Speech API (not in lib.dom by default).
type SpeechRecognitionResult = {
  0: { transcript: string };
  isFinal: boolean;
};
type SpeechRecognitionEvent = {
  resultIndex: number;
  results: { length: number; [i: number]: SpeechRecognitionResult };
};
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
}
type SRConstructor = new () => SpeechRecognitionLike;

function getSR(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

const LANGS = [
  { code: "en-US", label: "EN" },
  { code: "es-US", label: "ES" },
  { code: "es-MX", label: "ES·MX" },
];

type Props = {
  // Called with each finalized chunk — append it to the note body.
  onFinal: (text: string) => void;
  // Called with the live interim transcript — render it greyed.
  onInterim: (text: string) => void;
};

export function VoiceRecorder({ onFinal, onInterim }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("en-US");
  const langRef = useRef(lang);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  // Keep latest callbacks without restarting recognition.
  const onFinalRef = useRef(onFinal);
  const onInterimRef = useRef(onInterim);

  // Detect support on the client only.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(getSR() !== null);
  }, []);

  // Mirror latest props/state into refs (after render, not during).
  useEffect(() => {
    onFinalRef.current = onFinal;
    onInterimRef.current = onInterim;
    langRef.current = lang;
  });

  // Stop recognition on unmount.
  useEffect(() => {
    const rec = recRef;
    return () => {
      rec.current?.stop();
    };
  }, []);

  function start() {
    const SR = getSR();
    if (!SR) return;
    const rec = new SR();
    rec.lang = langRef.current;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) onFinalRef.current(r[0].transcript);
        else interim += r[0].transcript;
      }
      onInterimRef.current(interim);
    };
    rec.onerror = () => {
      onInterimRef.current("");
      setListening(false);
    };
    rec.onend = () => {
      onInterimRef.current("");
      setListening(false);
    };

    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  function stop() {
    recRef.current?.stop();
    setListening(false);
  }

  // While unknown (first paint) render nothing to avoid a flicker.
  if (supported === null) return null;

  if (!supported) {
    return (
      <span className="text-xs text-text-soft">
        🎙️ Voice isn’t supported in this browser — typing works great though.
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={listening ? stop : start}
        aria-pressed={listening}
        className="press flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
        style={{
          background: listening ? "var(--accent)" : "var(--bg-2)",
          color: listening ? "var(--on-accent)" : "var(--text)",
        }}
      >
        <span className={listening ? "animate-rec" : ""}>
          <Mic className="h-4 w-4" />
        </span>
        {listening ? "Listening…" : "Dictate"}
      </button>

      {/* Language picker */}
      <div className="flex overflow-hidden rounded-full border border-line">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => {
              setLang(l.code);
              langRef.current = l.code;
              if (listening) {
                stop();
                // restart with the new language on the next tick
                window.setTimeout(start, 120);
              }
            }}
            className="px-2.5 py-1 text-xs"
            style={{
              background: lang === l.code ? "var(--accent)" : "transparent",
              color: lang === l.code ? "var(--on-accent)" : "var(--text-soft)",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
