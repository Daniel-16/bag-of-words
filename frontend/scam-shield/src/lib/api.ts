const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:8000" : "https://bag-of-words.onrender.com");

export interface PredictRequest {
  text: string;
}

export interface PredictResponse {
  label: "SCAM / FRAUD" | "LEGITIMATE";
  confidence: number;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

export interface CheckHistoryItem {
  id: string;
  text: string;
  label: "SCAM / FRAUD" | "LEGITIMATE";
  confidence: number;
  timestamp: number;
}

export class APIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function predictFraud(text: string): Promise<PredictResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new APIError(
      response.status,
      errorData.detail || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new APIError(response.status, "Health check failed");
  }

  return response.json();
}

// LocalStorage helpers for check history
const HISTORY_KEY = "baggage_check_history";
const MAX_HISTORY_ITEMS = 20;

export function getCheckHistory(): CheckHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToCheckHistory(item: Omit<CheckHistoryItem, "id" | "timestamp">): CheckHistoryItem {
  const history = getCheckHistory();
  const newItem: CheckHistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

  return newItem;
}

export function clearCheckHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
