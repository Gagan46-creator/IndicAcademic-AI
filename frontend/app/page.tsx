import Link from "next/link";

const features = [
  { icon: "📚", title: "Syllabus-Based Learning", text: "Organize your learning according to university, semester, subject, and module.", soon: false },
  { icon: "🤖", title: "AI Question Answering", text: "Ask questions from your academic materials and receive relevant explanations.", soon: false },
  { icon: "📝", title: "Exam-Oriented Answers", text: "Generate structured answers according to 2-mark, 5-mark, and 10-mark requirements.", soon: false },
  { icon: "📄", title: "Academic Document Support", text: "Upload PDFs, notes, and textbooks for academic assistance.", soon: false },
  { icon: "🧠", title: "Smart Quizzes", text: "Practice your subjects using automatically generated quizzes and concept-check questions.", soon: true },
  { icon: "📊", title: "Learning Progress", text: "Track your quiz performance and academic learning progress in one place.", soon: true },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              IndicAcademic <span className="text-blue-400">AI</span>
            </h1>
            <p className="text-xs text-slate-400">Intelligent Academic Companion</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            AI-Powered Academic Assistance
          </div>
          <h2 className="text-5xl font-bold leading-tight md:text-6xl">
            Your Intelligent
            <span className="block text-blue-400">Academic Companion</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Study smarter with syllabus-aligned AI assistance designed
            specifically for Indian university curricula.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-700"
            >
              Start Learning
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 hover:bg-slate-900"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-bold">Everything You Need to Study Better</h3>
          <p className="mt-3 text-slate-400">One platform for your academic preparation.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
              <div className="mb-5 text-4xl">{f.icon}</div>
              <h4 className="text-xl font-semibold">{f.title}</h4>
              <p className="mt-3 leading-7 text-slate-400">{f.text}</p>
              {f.soon && (
                <span className="mt-4 inline-block rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h3 className="text-3xl font-bold">Ready to Study Smarter?</h3>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Upload your academic materials and let IndicAcademic AI become
            your intelligent study companion.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-6 text-center">
        <p className="text-sm text-slate-500">
          © 2026 IndicAcademic AI. Intelligent Academic Companion for Indian Curricula.
        </p>
      </footer>
    </main>
  );
}