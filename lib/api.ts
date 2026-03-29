/**
 * BabyCare API Client
 * Connects the Next.js frontend to the Python FastAPI backend (http://localhost:8000)
 */

const API_BASE = "http://localhost:8000/api"

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }))
    throw new Error(err.detail || "Request failed")
  }
  return res.json()
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (data: { name: string; email: string; phone?: string; password: string; role: string }) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  logout: () => request("/auth/logout", { method: "POST" }),

  me: () => request("/auth/me"),

  saveSession: (token: string, user: any) => {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("userName", user.name)
    localStorage.setItem("userRole", user.role)
    localStorage.setItem("userId", String(user.id))
  },

  clearSession: () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("userName")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userId")
  },
}

// ─── Doctors ───────────────────────────────────────────────────────────────

export const doctorApi = {
  listAll: () => request("/doctors"),
  getMyProfile: () => request("/doctors/me"),
  updateMyProfile: (data: any) => request("/doctors/me", { method: "PUT", body: JSON.stringify(data) }),
  getEarnings: () => request("/dashboard/earnings"),
  getSubscriptionStatus: () => request("/subscriptions/status"),
}

// ─── Bookings ──────────────────────────────────────────────────────────────

export const bookingApi = {
  create: (data: {
    doctor_profile_id: number
    date: string
    time: string
    home_number?: string
    address?: string
    city?: string
    state?: string
    country?: string
    phone?: string
    notes?: string
  }) => request("/bookings", { method: "POST", body: JSON.stringify(data) }),

  getMyBookings: () => request("/bookings/my"),

  updateStatus: (bookingId: number, action: "confirm" | "reject") =>
    request(`/bookings/${bookingId}`, { method: "PUT", body: JSON.stringify({ action }) }),
}

// ─── Chat ──────────────────────────────────────────────────────────────────

export const chatApi = {
  getContacts: () => request("/chat/contacts"),
  getMessages: (otherUserId: number) => request(`/chat/messages/${otherUserId}`),
  sendMessage: (recipientId: number, message: string, bookingId?: number) =>
    request("/chat/messages", {
      method: "POST",
      body: JSON.stringify({ recipient_id: recipientId, message, booking_id: bookingId }),
    }),
}

// ─── Medical Records ───────────────────────────────────────────────────────

export const recordsApi = {
  upload: (data: { file_name: string; file_type: string; file_base64: string }) =>
    request("/records", { method: "POST", body: JSON.stringify(data) }),

  getAll: () => request("/records"),

  delete: (id: number) => request(`/records/${id}`, { method: "DELETE" }),
}

// ─── Subscriptions ─────────────────────────────────────────────────────────

export const subscriptionApi = {
  subscribe: (payment_method: string, plan = "professional") =>
    request("/subscriptions", { method: "POST", body: JSON.stringify({ payment_method, plan }) }),

  getStatus: () => request("/subscriptions/status"),
}

// ─── Health Prediction ─────────────────────────────────────────────────────

export const healthApi = {
  predict: (metrics: {
    age: number
    weight: number
    bloodPressureSys: number
    bloodPressureDia: number
    bloodSugar: number
  }) => request("/predict", { method: "POST", body: JSON.stringify(metrics) }),
}
