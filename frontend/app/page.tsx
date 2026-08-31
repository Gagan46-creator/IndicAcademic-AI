export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold">
              IndicAcademic <span className="text-blue-400">AI</span>
            </h1>

            <p className="text-xs text-slate-400">
              Intelligent Academic Companion
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
              Login
            </button>

            <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-700">
              Get Started
            </button>
          </div>

        </div>
      </nav>


      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-6 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            AI-Powered Academic Assistance
          </div>

          <h2 className="text-5xl font-bold leading-tight md:text-6xl">
            Your Intelligent

            <span className="block text-blue-400">
              Academic Companion
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Study smarter with syllabus-aligned AI assistance designed
            specifically for Indian university curricula.
          </p>

          <div className="mt-10 flex justify-center gap-4">

            <button className="rounded-xl bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-700">
              Start Learning
            </button>

            <button className="rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 hover:bg-slate-900">
              Explore Features
            </button>

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-24">

        <div className="mb-12 text-center">

          <h3 className="text-3xl font-bold">
            Everything You Need to Study Better
          </h3>

          <p className="mt-3 text-slate-400">
            One platform for your academic preparation.
          </p>

        </div>


        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">


          {/* Feature 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <div className="mb-5 text-4xl">
              📚
            </div>

            <h4 className="text-xl font-semibold">
              Syllabus-Based Learning
            </h4>

            <p className="mt-3 leading-7 text-slate-400">
              Organize your learning according to university,
              semester, subject, and module.
            </p>

          </div>


          {/* Feature 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <div className="mb-5 text-4xl">
              🤖
            </div>

            <h4 className="text-xl font-semibold">
              AI Question Answering
            </h4>

            <p className="mt-3 leading-7 text-slate-400">
              Ask questions from your academic materials and
              receive relevant AI-generated explanations.
            </p>

          </div>


          {/* Feature 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <div className="mb-5 text-4xl">
              📝
            </div>

            <h4 className="text-xl font-semibold">
              Exam-Oriented Answers
            </h4>

            <p className="mt-3 leading-7 text-slate-400">
              Generate structured answers according to
              2-mark, 5-mark, and 10-mark requirements.
            </p>

          </div>


          {/* Feature 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <div className="mb-5 text-4xl">
              📄
            </div>

            <h4 className="text-xl font-semibold">
              Academic Document Support
            </h4>

            <p className="mt-3 leading-7 text-slate-400">
              Upload PDFs, notes, textbooks, and previous-year
              question papers for academic assistance.
            </p>

          </div>


          {/* Feature 5 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <div className="mb-5 text-4xl">
              🧠
            </div>

            <h4 className="text-xl font-semibold">
              Smart Quizzes
            </h4>

            <p className="mt-3 leading-7 text-slate-400">
              Practice your subjects using automatically
              generated quizzes and concept-check questions.
            </p>

          </div>


          {/* Feature 6 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <div className="mb-5 text-4xl">
              📊
            </div>

            <h4 className="text-xl font-semibold">
              Learning Progress
            </h4>

            <p className="mt-3 leading-7 text-slate-400">
              Track your quiz performance and academic
              learning progress in one place.
            </p>

          </div>

        </div>

      </section>


      {/* Call To Action */}
      <section className="border-t border-slate-800">

        <div className="mx-auto max-w-4xl px-6 py-20 text-center">

          <h3 className="text-3xl font-bold">
            Ready to Study Smarter?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Upload your academic materials and let
            IndicAcademic AI become your intelligent study companion.
          </p>

          <button className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-700">
            Get Started
          </button>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-6 text-center">

        <p className="text-sm text-slate-500">
          © 2026 IndicAcademic AI. Intelligent Academic Companion
          for Indian Curricula.
        </p>

      </footer>

    </main>
  );
}