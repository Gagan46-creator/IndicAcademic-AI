"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type User = { id: number; name: string; email: string };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/sign-in");
      return;
    }
    api<User>("/auth/me", {}, token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        router.replace("/sign-in");
      });
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/sign-in");
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
        <button
          onClick={logout}
          className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Logout
        </button>
      </nav>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-3xl font-bold">Hello, {user.name} 👋</h2>
        <p className="mt-2 text-slate-400">{user.email}</p>
      </section>
    </main>
  );
}