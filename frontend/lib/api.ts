export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data.detail;
    throw new Error(
      typeof detail === "string" ? detail : "Something went wrong"
    );
  }
  return data as T;
}