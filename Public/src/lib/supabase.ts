import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============ Types ============

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  qty: number;
  threshold: number;
  updated_at: string;
}

export interface Order {
  id: string;
  number: number;
  customer_name: string;
  status: string;
  priority: boolean;
  created_at: string;
  updated_at: string;
  session_id: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_id: string;
  qty: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  active: boolean;
  prep_time_seconds: number;
  created_at: string;
}

export interface Recipe {
  id: string;
  menu_id: string;
  inventory_id: string;
  quantity: number;
}

export interface RecipeWithDetails extends Recipe {
  inventory?: InventoryItem;
  menu_item?: MenuItem;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string | null;
  recorded_at: string;
}

export interface DailySession {
  id: string;
  session_date: string;
  location_id: string | null;
  opened_at: string;
  closed_at: string | null;
  total_orders: number;
  total_revenue: number;
  avg_prep_time_seconds: number | null;
  efficiency_score: number | null;
  notes: string | null;
  location?: Location;
}

export interface DailySessionWithDetails extends DailySession {
  location?: Location | null;
}

// ============ Helpers ============

export const STATUS_CONFIG: Record<string, { label: string; next: string | null; action: string | null; color: string }> = {
  recebido: { label: "Novo", next: "em_preparo", action: "Iniciar", color: "#FF6B35" },
  em_preparo: { label: "Preparando", next: "pronto", action: "Pronto!", color: "#FFA23B" },
  pronto: { label: "Pronto", next: "entregue", action: "Entregar", color: "#00C853" },
  entregue: { label: "Entregue", next: null, action: null, color: "#9AA0A6" },
};

export const CATEGORY_LABELS: Record<string, string> = {
  burger: "Burgers",
  side: "Acompanhamentos",
  drink: "Bebidas",
};

export const BOTTLENECK_MS = 15 * 60 * 1000;

export const fmtElapsed = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
};

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

export const formatTime = (date: string | Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};
