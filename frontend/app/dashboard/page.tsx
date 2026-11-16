"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, api } from "@/lib/api";

type User = { id: number; name: string; email: string };
type Doc = { id: number; filename: string; subject: string; module: string };

const inputCls =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-blue-500";

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [docId, setDocId] = useState("");
  const [question, setQuestion] = useState("");
  const [marks, setMarks] = useState(5);
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState("");

  const signOut = useCallback(() => {
    localStorage.removeItem("token");
    router.replace("/sign-in");
  }, [router]);

  const loadDocs = useCallback(
    async (t: string) => {
      try {
        const list = await api<Doc[]>("/documents", {}, t);
        setDocs(list);
        setDocId((prev) => prev || (list[0] ? String(list[0].id) : ""));
      } catch {
        signOut();
      }
    },
    [signOut]
  );

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.replace("/sign-in");
      return;
    }
    setToken(t);
    api<User>("/auth/me", {}, t).then(setUser).catch(signOut);
    loadDocs(t);
  }, [router, signOut, loadDocs]);

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (!file) {
      setUploadMsg("Choose a PDF first");
      return;
    }
    setUploading(true);
    setUploadMsg("");
    const form = new FormData();
    form.append("file", file);
    form.append("subject", subject);
    form.append("module", moduleName);
    try {
      const res = await fetch(`${API_URL}/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Upload failed");
      }
      setUploadMsg(`Uploaded ${data.filename}`);
      setFile(null);
      setSubject("");
      setModuleName("");
      formEl.reset();
      await loadDocs(token);
    } catch (err) {
      setUploadMsg(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: number) {
    try {
      await api(`/documents/${id}`, { method: "DELETE" }, token);
      if (String(id) === docId) setDocId("");
      await loadDocs(token);
    } catch {
      setUploadMsg("Could not delete that document");
    }
  }

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    setAskError("");
    setAnswer("");
    if (!docId) {
      setAskError("Upload and select a document first");
      return;
    }
    setAsking(true);
    try {
      const res = await api<{ answer: string }>(
        "/ask",
        {
          method: "POST",
          body: JSON.stringify({ document_id: Number(docId), question, marks }),
        },
        token
      );
      setAnswer(res.answer);
    } catch (err) {
      setAskError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setAsking(false);
    }
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <h1 className="text-xl font-bold">
          IndicAcademic <span className="text-blue-400">AI</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-400 sm:inline">{user.email}</span>
          <button
            onClick={signOut}
            className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-3xl font-bold">Hello, {user.name} 👋</h2>
        <p className="mt-2 text-slate-400">
          Upload your notes, then ask exam-style questions.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <form
              onSubmit={upload}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-lg font-semibold">Upload a PDF</h3>
              <label className="mt-4 block text-sm text-slate-300">PDF file (text-based)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-slate-200"
              />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-slate-300">Subject</label>
                  <input
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Operating Systems"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300">Module</label>
                  <input
                    required
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="Module 1"
                    className={inputCls}
                  />
                </div>
              </div>
              {uploadMsg && <p className="mt-4 text-sm text-slate-300">{uploadMsg}</p>}
              <button
                disabled={uploading}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </form>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold">My documents</h3>
              {docs.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">No documents yet. Upload one above.</p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-800">
                  {docs.map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{d.filename}</p>
                        <p className="text-xs text-slate-400">
                          {d.subject} · {d.module}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(d.id)}
                        className="rounded-lg px-3 py-1 text-xs text-red-300 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <form
            onSubmit={ask}
            className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <h3 className="text-lg font-semibold">Ask a question</h3>
            <label className="mt-4 block text-sm text-slate-300">Document</label>
            <select
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              className={inputCls}
            >
              <option value="">Select a document</option>
              {docs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.filename} ({d.subject}, {d.module})
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm text-slate-300">Question</label>
            <textarea
              required
              minLength={3}
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is a process?"
              className={inputCls}
            />

            <p className="mt-4 text-sm text-slate-300">Answer length</p>
            <div className="mt-2 flex gap-3">
              {[2, 5, 10].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMarks(m)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    marks === m
                      ? "bg-blue-600 text-white"
                      : "border border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {m} marks
                </button>
              ))}
            </div>

            {askError && (
              <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">
                {askError}
              </p>
            )}
            <button
              disabled={asking}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {asking ? "Thinking..." : "Get answer"}
            </button>

            {answer && (
              <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {marks}-mark answer
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-200">
                  {answer}
                </p>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}