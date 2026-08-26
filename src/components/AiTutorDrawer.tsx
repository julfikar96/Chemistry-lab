import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Loader2,
  BookOpen,
  Lightbulb,
  CheckCircle,
  HelpCircle as QuestionIcon,
  AlertTriangle,
  FileText,
  Brain,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export type TutorMode =
  | 'EXPLAIN'
  | 'SOCRATIC'
  | 'SOLVE'
  | 'HINT'
  | 'CHECK'
  | 'EXAM'
  | 'MISTAKE_ANALYSIS';

interface AiTutorMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  mode?: TutorMode;
}

interface AiTutorDrawerProps {
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
  onSaveToNotebook?: (title: string, notes: string) => void;
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  initialQuestion,
  onClearInitialQuestion,
  onSaveToNotebook,
}) => {
  const [currentMode, setCurrentMode] = useState<TutorMode>('EXPLAIN');
  const [messages, setMessages] = useState<AiTutorMessage[]>([
    {
      sender: 'ai',
      text: 'Hello and welcome! I am your AI Chemistry Tutor. You can ask me questions about atomic structure, electron configurations, VSEPR molecular geometry, chemical reactions, titration curves, or any mathematical problem.',
      timestamp: Date.now(),
      mode: 'EXPLAIN',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tutorModes: { id: TutorMode; label: string; icon: string; promptPrefix: string }[] = [
    {
      id: 'EXPLAIN',
      label: 'Simple Explanation',
      icon: '💡',
      promptPrefix: '[Explain in simple and understandable language]: ',
    },
    {
      id: 'SOCRATIC',
      label: 'Socratic Teaching',
      icon: '❓',
      promptPrefix: '[Instead of giving the direct answer, provide clues and questions to make me think]: ',
    },
    {
      id: 'SOLVE',
      label: 'Step-by-Step Solution',
      icon: '📐',
      promptPrefix: '[Solve step-by-step including formula names, value substitution, and units]: ',
    },
    {
      id: 'HINT',
      label: 'Clue/Hint',
      icon: '🔍',
      promptPrefix: '[Give me a small clue for the next step]: ',
    },
    {
      id: 'CHECK',
      label: 'Verify Answer',
      icon: '✅',
      promptPrefix: '[Check if my answer is correct and point out any mistakes]: ',
    },
    {
      id: 'EXAM',
      label: 'Exam Question',
      icon: '📝',
      promptPrefix: '[Give me a board or Olympiad standard question on this topic]: ',
    },
    {
      id: 'MISTAKE_ANALYSIS',
      label: 'Mistake Analysis',
      icon: '⚠️',
      promptPrefix: '[Analyze common mistakes students make on this topic]: ',
    },
  ];

  const quickQuestions = [
    'Why is heat produced in the neutralization reaction of dilute HCl and NaOH?',
    'What is the reason for the See-Saw shape of the SF4 molecule?',
    'Why does the solution turn green when an iron nail is placed in a CuSO4 solution?',
    'How can I calculate the pH of a buffer solution using the Henderson-Hasselbalch equation?',
    'Why is the heat of neutralization of strong acids and strong bases constant (-57.34 kJ)?',
    'Derive the ideal gas equation (PV=nRT) from the combined gas equation of Boyle and Charles.',
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle external initial question trigger (from lab or periodic table)
  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
      onClearInitialQuestion?.();
    }
  }, [initialQuestion]);

  const handleSendMessage = async (queryText?: string) => {
    const rawText = queryText || inputQuery;
    if (!rawText.trim() || isLoading) return;

    const currentModeConfig = tutorModes.find((m) => m.id === currentMode);
    const formattedQuery = `${currentModeConfig?.promptPrefix || ''}${rawText}`;

    const userMsg: AiTutorMessage = {
      sender: 'user',
      text: rawText,
      timestamp: Date.now(),
      mode: currentMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: formattedQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tutor response');
      }

      const data = await response.json();
      const reply =
        data.reply ||
        'Sorry, there was a problem generating the answer. Please try again.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          timestamp: Date.now(),
          mode: currentMode,
        },
      ]);
      soundEngine.playSuccessChime();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'There was a temporary problem communicating with the server. Please check your internet connection or server configuration.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>AI Chemistry Tutor 2.0</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                  7 Smart Modes
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Your reliable companion for any equation and explanation in SSC, HSC, Olympiads, and practical chemistry.
              </p>
            </div>
          </div>
        </div>

        {/* 7 Smart Tutor Modes Selector */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Learning Mode:</span>
          </span>
          {tutorModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setCurrentMode(mode.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                currentMode === mode.id
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Suggested Quick Question Prompts */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Questions:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all text-left active:scale-95 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Log Arena */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl flex flex-col min-h-[480px] max-h-[600px] overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((msg, idx) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={idx}
                className={`flex gap-3 text-xs md:text-sm ${
                  isAI ? 'justify-start' : 'justify-end'
                }`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-4 rounded-3xl space-y-2 ${
                    isAI
                      ? 'bg-slate-950/80 border border-slate-800 text-slate-200 leading-relaxed'
                      : 'bg-cyan-600 text-slate-950 font-medium ml-auto rounded-tr-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  <div
                    className={`flex items-center justify-between text-[10px] pt-1.5 border-t ${
                      isAI ? 'border-slate-800/80 text-slate-500' : 'border-cyan-700/50 text-slate-900'
                    }`}
                  >
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isAI && onSaveToNotebook && (
                      <button
                        onClick={() => onSaveToNotebook('AI Tutor Note', msg.text)}
                        className="hover:text-cyan-400 font-medium flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Save to Notebook</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span>AI Tutor is preparing the chemistry answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="pt-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Write your question in Bengali (eg: Why is the bond angle of H2O 104.5° according to VSEPR data?)…"
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isLoading}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              inputQuery.trim() && !isLoading
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
