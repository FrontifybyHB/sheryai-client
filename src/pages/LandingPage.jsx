import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIVideoChat, VideoStudio } from '../components/HeroDemo';
import AppIcon from '../components/AppIcon';

const features = [
  ['speed', '10x Faster Revision', 'Jump straight to the ideas that matter without scrubbing through long videos.'],
  ['brain', 'Context-Aware AI', 'Ask questions grounded in your own lecture, transcript, timestamps, and chapters.'],
  ['file', 'Smart Summaries', 'Generate concise notes and review material from any processed lecture.'],
];

export default function LandingPage() {
  const navigate = useNavigate();
  const demoRef = useRef(null);
  const chatRef = useRef(null);
  const [activeLesson, setActiveLesson] = useState(null);

  const goLogin = () => navigate('/login');
  const handleLessonReady = (lesson) => {
    setActiveLesson(lesson);
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">
          <a href="#home" className="text-xl font-black tracking-tight">
            SHERY <span className="text-accent">AI</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-text md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#studio" className="hover:text-white">Studio</a>
            <a href="#ai-chat" className="hover:text-white">AI Chat</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" onClick={goLogin} className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-muted-text md:block">
              Sign In
            </button>
            <button type="button" onClick={goLogin} className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="relative overflow-hidden border-b border-white/10 px-6 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,87,42,0.22),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl text-center">
            <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Learn <span className="text-accent">Faster</span>. Understand <span className="text-accent">Better</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-text">
              AI-powered learning companion that turns video lectures into searchable, conversational study sessions.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={goLogin} className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white">
                Start Learning
              </button>
              <button type="button" onClick={() => demoRef.current?.scrollIntoView({ behavior: 'smooth' })} className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white">
                Try Demo
              </button>
            </div>

            <div className="mx-auto mt-16 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
              <div className="mb-5 flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex aspect-video items-center justify-center rounded-2xl bg-black text-accent">
                  <AppIcon name="play" size={44} />
                </div>
                <div className="flex flex-col gap-3">
                  {['What is gradient descent?', 'Explain backpropagation', 'Jump to 14:22'].map((item, index) => (
                    <div key={item} className={`rounded-xl border px-4 py-3 text-sm ${index === 2 ? 'border-accent-border bg-accent/10 text-accent' : 'border-white/10 bg-white/[0.04] text-muted-text'}`}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-white/10 px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {features.map(([icon, title, desc]) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <AppIcon name={icon} size={30} className="mb-5 text-accent" />
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-6 text-muted-text">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="studio" ref={demoRef} className="border-b border-white/10 bg-[#070707] px-6 py-20">
          <SectionHeader
            icon="video"
            eyebrow="Video Studio"
            title="Add Any Video. AI Does the Rest."
            text="Paste a YouTube URL or upload your lecture. SheryAI transcribes, indexes, and makes it fully conversational."
          />
          <VideoStudio onLessonReady={handleLessonReady} />
        </section>

        <section id="ai-chat" ref={chatRef} className="border-b border-white/10 bg-[#050505] px-6 py-20">
          <SectionHeader
            icon="bot"
            eyebrow="AI Video Chat"
            title="ChatGPT, but for Your Videos"
            text="Ask anything, get timestamped answers, and understand every concept your lecturer explains."
          />

          {activeLesson ? (
            <div className="mx-auto h-[680px] max-w-[900px] overflow-hidden rounded-3xl border border-[#1a1a1a] shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
              <AIVideoChat lesson={activeLesson} onBack={() => setActiveLesson(null)} />
            </div>
          ) : (
            <div className="mx-auto max-w-[720px] rounded-3xl border border-[#1a1a1a] bg-[#0a0a0a] p-12 text-center">
              <AppIcon name="video" size={52} strokeWidth={1.8} className="mb-5 text-accent" />
              <h3 className="mb-3 text-[22px] font-extrabold">Add a Video First</h3>
              <p className="mb-7 text-sm leading-6 text-muted-text">Use the Video Studio above to add a YouTube lecture or upload a video.</p>
              <button type="button" onClick={() => demoRef.current?.scrollIntoView({ behavior: 'smooth' })} className="rounded-xl bg-accent px-7 py-3 text-sm font-bold text-white">
                Go to Video Studio
              </button>
            </div>
          )}
        </section>

        <section className="px-6 py-24 text-center">
          <h2 className="mx-auto max-w-3xl text-4xl font-black md:text-5xl">Ready to transform the way you learn?</h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-text">Start with the demo role selector and move directly into the learning dashboard.</p>
          <button type="button" onClick={goLogin} className="mt-8 rounded-xl bg-accent px-7 py-3 text-sm font-bold text-white">
            Start Learning Now
          </button>
        </section>
      </main>

      <footer id="contact" className="border-t border-white/10 bg-black px-6 py-10 text-center text-sm text-muted">
        SheryAI. Built for modern video learning.
      </footer>
    </div>
  );
}

function SectionHeader({ icon, eyebrow, title, text }) {
  return (
    <header className="mx-auto mb-12 max-w-3xl text-center">
      <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
        <AppIcon name={icon} size={15} /> {eyebrow}
      </span>
      <h2 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">{title}</h2>
      <p className="mx-auto max-w-xl text-sm leading-6 text-muted-text">{text}</p>
    </header>
  );
}
