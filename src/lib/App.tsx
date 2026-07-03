import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus, Minus, X, Clock, AlertTriangle, Package, ClipboardList, Star, Loader2,
  MapPin, TrendingUp, Calendar, Edit2, Trash2, Check, UtensilsCrossed, History, Play
} from "lucide-react";
import {
  supabase,
  type InventoryItem,
  type OrderWithItems,
  type OrderItem,
  type MenuItem,
  type Recipe,
  type DailySessionWithDetails,
  STATUS_CONFIG,
  CATEGORY_LABELS,
  BOTTLENECK_MS,
  fmtElapsed,
  formatCurrency,
  formatDate,
  formatTime,
} from "./lib/supabase";

// ============ Hortolândia Fake Locations ============

const HORTOLANDIA_STREETS = [
  { address: "Rua das Flores, 123 - Centro, Hortolândia - SP", lat: -22.8592, lng: -47.2278 },
  { address: "Av. Brasil, 456 - Jardim São Pedro, Hortolândia - SP", lat: -22.8651, lng: -47.2201 },
  { address: "Rua 7 de Setembro, 789 - Centro, Hortolândia - SP", lat: -22.8613, lng: -47.2245 },
  { address: "Av. Santana, 321 - Jardim Santana, Hortolândia - SP", lat: -22.8724, lng: -47.2156 },
  { address: "Rua Portugal, 567 - Jardim Europa, Hortolândia - SP", lat: -22.8687, lng: -47.2312 },
];

const getRandomLocation = () => HORTOLANDIA_STREETS[Math.floor(Math.random() * HORTOLANDIA_STREETS.length)];

// ============ Mascot Component ============

function Mascot({ size = 40, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <div
      style={{ width: size, height: size, background: "#FF6B35" }}
      className={`rounded-full flex items-center justify-center text-xl shrink-0 relative ${animated ? "animate-bounce" : ""}`}
    >
      <span style={{ fontSize: size * 0.55 }}>🍔</span>
      <span style={{ fontSize: size * 0.4, right: -4, bottom: -4 }} className="absolute rotate-12">🍳</span>
    </div>
  );
}

// ============ Welcome Screen ============

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#FFF8F3] to-[#FFE8D6] flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FF6B35]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#FFA23B]/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div
          className="absolute top-1/4 right-10 text-6xl opacity-30 animate-float"
          style={{ animationDelay: "0s" }}
        >
          🍔
        </div>
        <div
          className="absolute bottom-1/3 left-8 text-5xl opacity-30 animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          🍟
        </div>
        <div
          className="absolute top-1/3 left-1/4 text-4xl opacity-30 animate-float"
          style={{ animationDelay: "1s" }}
        >
          🥤
        </div>
      </div>

      {/* Main content */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Mascot Animation */}
        <div className="relative mb-6">
          <div className="w-40 h-40 bg-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden border-4 border-[#FF6B35]">
            {/* Girl mascot with orange cap and apron */}
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {/* Body */}
              <ellipse cx="50" cy="85" rx="25" ry="12" fill="#FF6B35" />
              {/* Apron */}
              <path d="M30 60 Q50 55 70 60 L75 90 Q50 95 25 90 Z" fill="#FF6B35" />
              <rect x="42" y="65" width="16" height="12" rx="2" fill="#E55A2B" />
              {/* Body/Torso */}
              <ellipse cx="50" cy="55" rx="20" ry="18" fill="#FFF" />
              {/* Neck */}
              <rect x="44" y="38" width="12" height="8" fill="#FFDAB9" />
              {/* Head */}
              <circle cx="50" cy="30" r="18" fill="#FFDAB9" />
              {/* Hair */}
              <path d="M32 25 Q32 10 50 10 Q68 10 68 25 L68 35 Q50 38 32 35 Z" fill="#4A3728" />
              <path d="M32 25 Q35 30 32 35" fill="#4A3728" />
              <path d="M68 25 Q65 30 68 35" fill="#4A3728" />
              {/* Cap */}
              <ellipse cx="50" cy="15" rx="20" ry="8" fill="#FF6B35" />
              <rect x="32" y="12" width="36" height="8" rx="2" fill="#FF6B35" />
              <rect x="28" y="14" width="44" height="6" rx="3" fill="#E55A2B" />
              {/* Face */}
              <circle cx="44" cy="28" r="2" fill="#4A3728" />
              <circle cx="56" cy="28" r="2" fill="#4A3728" />
              <path d="M46 35 Q50 38 54 35" fill="none" stroke="#E55A2B" strokeWidth="2" strokeLinecap="round" />
              {/* Cheeks */}
              <circle cx="40" cy="33" r="3" fill="#FFB6A3" opacity="0.6" />
              <circle cx="60" cy="33" r="3" fill="#FFB6A3" opacity="0.6" />
              {/* Arm with spatula */}
              <path d="M70 55 Q80 50 85 60 Q88 65 85 70 L75 65 Z" fill="#FFDAB9" />
              {/* Spatula */}
              <rect x="82" y="45" width="3" height="25" rx="1" fill="#78716C" transform="rotate(20 83 57)" />
              <ellipse cx="88" cy="43" rx="8" ry="5" fill="#A8A29E" transform="rotate(20 88 43)" />
              {/* Other arm */}
              <path d="M30 55 Q20 50 18 58 Q15 65 20 70 L28 65 Z" fill="#FFDAB9" />
            </svg>
            {/* Sizzle effect */}
            <div className="absolute -top-2 -right-2 text-2xl animate-ping">💨</div>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-[#FF6B35]/30 rounded-full blur-xl scale-110 -z-10" />
        </div>

        {/* Text */}
        <h1 className="text-4xl font-extrabold text-[#FF6B35] mb-2 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Grelha
        </h1>
        <p className="text-[#5C5850] text-lg mb-1">Food Truck Manager</p>
        <p className="text-[#9AA0A6] text-sm mb-8">Sistema inteligente de pedidos</p>

        {/* Start button */}
        <button
          onClick={onStart}
          className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold text-lg rounded-2xl px-8 py-4 flex items-center gap-3 shadow-lg shadow-[#FF6B35]/30 active:scale-95 transition-all duration-200"
        >
          <Play size={24} fill="white" />
          Começar
        </button>

        {/* Version */}
        <p className="mt-8 text-xs text-[#9AA0A6]">v2.0 • Feito com ❤️</p>
      </div>

      {/* Floating emojis animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// ============ Monitoring Widget ============

function MonitoringWidget({ preparing, waiting }: { preparing: number; waiting: number }) {
  return (
    <div className="fixed top-20 right-2 z-30 bg-white rounded-2xl shadow-lg border border-[#EEE9E2] p-3 min-w-[140px]">
      <div className="text-xs font-semibold text-[#5C5850] mb-2 flex items-center gap-1">
        <UtensilsCrossed size={12} /> Monitor
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#9AA0A6]">Preparando</span>
          <span className="text-sm font-bold text-[#FFA23B]">{preparing}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#9AA0A6]">Na fila</span>
          <span className="text-sm font-bold text-[#FF6B35]">{waiting}</span>
        </div>
      </div>
    </div>
  );
}

// ============ Queue Alert Modal ============

interface QueueAlertData {
  skippedOrderId: string;
  skippedOrderNumber: number;
  skippedCustomerName: string;
  waitTimeMs: number;
}

function QueueAlertModal({
  alert,
  onContinue,
  onCancel,
}: {
  alert: QueueAlertData;
  onContinue: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF0EC] flex items-center justify-center">
            <AlertTriangle className="text-[#D64550]" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#2B2620]">Atenção!</h3>
            <p className="text-sm text-[#9AA0A6]">Pedido fora de ordem</p>
          </div>
        </div>

        <p className="text-[#5C5850] mb-4 text-sm leading-relaxed">
          Este pedido foi iniciado <strong>fora de ordem</strong>. O pedido{" "}
          <strong className="text-[#FF6B35]">#{alert.skippedOrderNumber}</strong> de{" "}
          <strong>{alert.skippedCustomerName}</strong> está esperando há{" "}
          <strong className="text-[#D64550]">{fmtElapsed(alert.waitTimeMs)}</strong> e provavelmente irá se atrasar.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border-2 border-[#EEE9E2] text-[#5C5850] font-semibold text-sm hover:bg-[#F8F6F2] transition-colors"
          >
            Voltar para fila
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-3 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E55A2B] transition-colors"
          >
            Continuar mesmo assim
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ Order Card ============

function OrderCard({
  order,
  now,
  onAdvance,
}: {
  order: OrderWithItems;
  now: number;
  onAdvance: (id: string, skipAlert?: boolean) => void;
}) {
  const elapsed = now - new Date(order.created_at).getTime();
  const late = order.status !== "pronto" && elapsed > BOTTLENECK_MS;
  const st = STATUS_CONFIG[order.status];
  if (!st) return null;

  const itemNames = order.items.map(({ menu_id, qty }) => `${qty}x ${menu_id}`).join(", ");

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border ${late ? "border-[#D64550]" : "border-[#EEE9E2]"}`}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-bold text-2xl text-[#2B2620]">#{order.number}</span>
        <div className="flex items-center gap-2">
          {order.priority && <Star size={16} className="text-[#FF6B35]" fill="#FF6B35" />}
          <span className={`text-xs font-semibold ${late ? "text-[#D64550]" : "text-[#9AA0A6]"} flex items-center gap-1`}>
            <Clock size={12} /> {fmtElapsed(elapsed)}
          </span>
        </div>
      </div>
      <div className="text-sm text-[#5C5850] mb-2">{order.customer_name}</div>
      <div className="text-sm text-[#2B2620] mb-3">{itemNames}</div>
      <div
        className="text-[10px] font-bold uppercase inline-block px-2 py-0.5 rounded-full mb-2 text-white"
        style={{ background: st.color }}
      >
        {st.label}
      </div>
      {st.next && (
        <button
          onClick={() => onAdvance(order.id)}
          style={{ background: st.color }}
          className="w-full text-white font-bold text-base rounded-xl py-3.5 active:scale-[0.98] transition-transform shadow-sm"
        >
          {st.action}
        </button>
      )}
    </div>
  );
}

// ============ Pedidos Screen ============

function PedidosScreen({
  orders,
  now,
  onAdvance,
  bottlenecked,
}: {
  orders: OrderWithItems[];
  now: number;
  onAdvance: (id: string, skipAlert?: boolean) => void;
  bottlenecked: OrderWithItems[];
}) {
  return (
    <div className="px-4 pt-3">
      {bottlenecked.length > 0 && (
        <div className="bg-[#FFF0EC] text-[#D64550] rounded-xl px-3 py-2 mb-3 flex items-center gap-2 text-xs font-medium">
          <AlertTriangle size={15} />
          {bottlenecked.length} pedido(s) esperando há mais de 15 min
        </div>
      )}
      {orders.length === 0 && (
        <div className="text-center text-[#9AA0A6] text-sm mt-16">Nenhum pedido na fila. Toque em + para lançar um.</div>
      )}
      <div className="space-y-3">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} now={now} onAdvance={onAdvance} />
        ))}
      </div>
    </div>
  );
}

// ============ Estoque Screen ============

function EstoqueScreen({ inventory, lowStock }: { inventory: InventoryItem[]; lowStock: InventoryItem[] }) {
  return (
    <div className="px-4 pt-3">
      {lowStock.length > 0 && (
        <div className="bg-[#FFF0EC] text-[#D64550] rounded-xl px-3 py-2 mb-3 flex items-center gap-2 text-xs font-medium">
          <AlertTriangle size={15} />
          {lowStock.length} ingrediente(s) acabando
        </div>
      )}
      <div className="space-y-2.5">
        {inventory.map((ing) => {
          const low = ing.qty <= ing.threshold;
          const pct = Math.min(100, (ing.qty / (ing.threshold * 4)) * 100);
          return (
            <div key={ing.id} className={`bg-white rounded-2xl p-4 border ${low ? "border-[#D64550]" : "border-[#EEE9E2]"}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-[#2B2620]">{ing.name}</span>
                <span className="text-sm text-[#9AA0A6]">{ing.qty} {ing.unit}</span>
              </div>
              <div className="h-2 bg-[#F1EEE7] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: low ? "#D64550" : "#00C853" }} />
              </div>
              {low && <div className="text-[11px] text-[#D64550] mt-1.5 font-medium">estoque baixo — repor logo</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Menu Management Screen ============

function MenuManagementScreen({
  menuItems,
  recipes,
  inventory,
  onRefresh,
}: {
  menuItems: MenuItem[];
  recipes: Recipe[];
  inventory: InventoryItem[];
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const groupedMenu = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    menuItems.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [menuItems]);

  const getMenuRecipes = (menuId: string) => recipes.filter((r) => r.menu_id === menuId);

  return (
    <div className="px-4 pt-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-[#2B2620]">Cardápio</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-[#FF6B35] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
          <Plus size={20} />
        </button>
      </div>

      {Object.entries(groupedMenu).map(([category, items]) => (
        <div key={category} className="mb-4">
          <h3 className="text-xs font-semibold text-[#9AA0A6] uppercase tracking-wider mb-2">
            {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="space-y-2">
            {items.map((item) => {
              const itemRecipes = getMenuRecipes(item.id);
              return (
                <div key={item.id} className={`bg-white rounded-2xl p-4 border ${item.active ? "border-[#EEE9E2]" : "border-[#D64550] opacity-60"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-[#2B2620]">{item.name}</div>
                      <div className="text-xs text-[#9AA0A6]">{item.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#FF6B35]">{formatCurrency(item.price)}</div>
                      <div className="text-xs text-[#9AA0A6]">{Math.floor(item.prep_time_seconds / 60)} min</div>
                    </div>
                  </div>
                  {itemRecipes.length > 0 && (
                    <div className="text-xs text-[#5C5850] mb-2">
                      <span className="font-medium">Ingredientes: </span>
                      {itemRecipes.map((r) => {
                        const inv = inventory.find((i) => i.id === r.inventory_id);
                        return `${r.quantity}${inv?.unit || ""} ${inv?.name || r.inventory_id}`;
                      }).join(", ")}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditing(item); setShowForm(true); }}
                      className="flex-1 py-2 text-xs font-medium text-[#5C5850] bg-[#F1EEE7] rounded-lg flex items-center justify-center gap-1"
                    >
                      <Edit2 size={12} /> Editar
                    </button>
                    <button
                      onClick={async () => {
                        await supabase.from("menu_items").update({ active: !item.active }).eq("id", item.id);
                        onRefresh();
                      }}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 ${
                        item.active ? "bg-[#FFF0EC] text-[#D64550]" : "bg-[#E8F5E9] text-[#00C853]"
                      }`}
                    >
                      {item.active ? <X size={12} /> : <Check size={12} />}
                      {item.active ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {showForm && (
        <MenuItemForm
          item={editing}
          inventory={inventory}
          recipes={editing ? getMenuRecipes(editing.id) : []}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={async () => {
            setSaving(true);
            await onRefresh();
            setSaving(false);
            setShowForm(false);
            setEditing(null);
          }}
          saving={saving}
        />
      )}
    </div>
  );
}

function MenuItemForm({
  item,
  inventory,
  recipes,
  onClose,
  onSave,
  saving,
}: {
  item: MenuItem | null;
  inventory: InventoryItem[];
  recipes: Recipe[];
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price?.toString() || "");
  const [category, setCategory] = useState(item?.category || "burger");
  const [prepTime, setPrepTime] = useState(item?.prep_time_seconds?.toString() || "300");
  const [ingredientList, setIngredientList] = useState<{ inventory_id: string; quantity: string }[]>(
    recipes.length > 0 ? recipes.map((r) => ({ inventory_id: r.inventory_id, quantity: r.quantity.toString() })) : [{ inventory_id: "", quantity: "" }]
  );

  const addIngredient = () => setIngredientList([...ingredientList, { inventory_id: "", quantity: "" }]);
  const removeIngredient = (idx: number) => setIngredientList(ingredientList.filter((_, i) => i !== idx));
  const updateIngredient = (idx: number, field: "inventory_id" | "quantity", value: string) => {
    setIngredientList(ingredientList.map((ing, i) => (i === idx ? { ...ing, [field]: value } : ing)));
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price) return;

    const menuId = item?.id || name.toLowerCase().replace(/\s+/g, "_");
    const menuData = { id: menuId, name: name.trim(), description: description.trim() || null, price: parseFloat(price), category, prep_time_seconds: parseInt(prepTime) || 300, active: true };

    if (item) {
      await supabase.from("menu_items").update(menuData).eq("id", item.id);
      await supabase.from("recipes").delete().eq("menu_id", item.id);
    } else {
      await supabase.from("menu_items").insert(menuData);
    }

    const validRecipes = ingredientList.filter((r) => r.inventory_id && r.quantity);
    if (validRecipes.length > 0) {
      const recipeData = validRecipes.map((r) => ({ menu_id: menuId, inventory_id: r.inventory_id, quantity: parseFloat(r.quantity) }));
      await supabase.from("recipes").insert(recipeData);
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-40">
      <div className="w-full max-w-sm bg-white rounded-t-3xl p-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg">{item ? "Editar Item" : "Novo Item"}</span>
          <button onClick={onClose}><X size={22} /></button>
        </div>

        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do item" className="w-full border border-[#EEE9E2] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35]" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição (opcional)" className="w-full border border-[#EEE9E2] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35]" />
          <div className="flex gap-2">
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Preço (R$)" type="number" step="0.01" className="flex-1 border border-[#EEE9E2] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35]" />
            <input value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="Tempo (seg)" type="number" className="w-24 border border-[#EEE9E2] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35]" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-[#EEE9E2] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35]">
            <option value="burger">Burger</option>
            <option value="side">Acompanhamento</option>
            <option value="drink">Bebida</option>
          </select>

          <div className="border-t border-[#EEE9E2] pt-3 mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[#2B2620]">Ficha Técnica</span>
              <button onClick={addIngredient} className="text-[#FF6B35] text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {ingredientList.map((ing, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select value={ing.inventory_id} onChange={(e) => updateIngredient(idx, "inventory_id", e.target.value)} className="flex-1 border border-[#EEE9E2] rounded-lg px-2 py-2 text-xs outline-none">
                    <option value="">Ingrediente...</option>
                    {inventory.map((inv) => (<option key={inv.id} value={inv.id}>{inv.name}</option>))}
                  </select>
                  <input value={ing.quantity} onChange={(e) => updateIngredient(idx, "quantity", e.target.value)} placeholder="Qtd" type="number" className="w-16 border border-[#EEE9E2] rounded-lg px-2 py-2 text-xs outline-none" />
                  {ingredientList.length > 1 && (<button onClick={() => removeIngredient(idx)} className="text-[#D64550]"><Trash2 size={16} /></button>)}
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={!name.trim() || !price || saving} className="w-full bg-[#FF6B35] disabled:bg-[#F1EEE7] disabled:text-[#9AA0A6] text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2">
            {saving && <Loader2 size={18} className="animate-spin" />}
            {item ? "Salvar" : "Criar Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ History Screen ============

function HistoryScreen({
  sessions,
  todayOrders,
  onStartDay,
  onEndDay,
  dayActive,
}: {
  sessions: DailySessionWithDetails[];
  todayOrders: OrderWithItems[];
  onStartDay: () => void;
  onEndDay: () => void;
  dayActive: boolean;
}) {
  const todayMetrics = useMemo(() => {
    const delivered = todayOrders.filter((o) => o.status === "entregue");
    const totalRevenue = delivered.reduce((sum, o) => {
      return sum + o.items.reduce((itemSum, item) => itemSum + 100 * item.qty, 0) / 100;
    }, 0);
    const prepTimes = delivered.filter((o) => o.started_at && o.completed_at).map((o) => new Date(o.completed_at!).getTime() - new Date(o.started_at!).getTime());
    const avgPrepTime = prepTimes.length > 0 ? prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length : 0;
    const todaySession = sessions.find((s) => s.session_date === new Date().toISOString().split("T")[0]);
    return { totalOrders: todayOrders.length, delivered: delivered.length, totalRevenue, avgPrepTime, efficiency: todaySession?.efficiency_score || 0 };
  }, [todayOrders, sessions]);

  return (
    <div className="px-4 pt-3">
      {/* Today's Status */}
      <div className="bg-white rounded-2xl p-4 border border-[#EEE9E2] mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#FF6B35]" />
            <span className="font-semibold text-[#2B2620]">{formatDate(new Date())}</span>
          </div>
          <div className={`text-xs font-bold px-2 py-1 rounded-full ${dayActive ? "bg-[#E8F5E9] text-[#00C853]" : "bg-[#F1EEE7] text-[#9AA0A6]"}`}>
            {dayActive ? "Aberto" : "Fechado"}
          </div>
        </div>

        {!dayActive ? (
          <button onClick={onStartDay} className="w-full bg-[#00C853] text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2">
            <Play size={18} /> Iniciar Dia
          </button>
        ) : (
          <button onClick={onEndDay} className="w-full bg-[#D64550] text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2">
            <X size={18} /> Encerrar Dia
          </button>
        )}
      </div>

      {/* Today's Metrics */}
      {dayActive && (
        <div className="bg-white rounded-2xl p-4 border border-[#EEE9E2] mb-4">
          <h3 className="font-semibold text-[#2B2620] mb-3 flex items-center gap-2">
            <TrendingUp size={16} /> Métricas de Hoje
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F8F6F2] rounded-xl p-3">
              <div className="text-2xl font-bold text-[#FF6B35]">{todayMetrics.totalOrders}</div>
              <div className="text-xs text-[#9AA0A6]">Pedidos</div>
            </div>
            <div className="bg-[#F8F6F2] rounded-xl p-3">
              <div className="text-2xl font-bold text-[#00C853]">{todayMetrics.delivered}</div>
              <div className="text-xs text-[#9AA0A6]">Entregues</div>
            </div>
            <div className="bg-[#F8F6F2] rounded-xl p-3">
              <div className="text-2xl font-bold text-[#2B2620]">{formatCurrency(todayMetrics.totalRevenue)}</div>
              <div className="text-xs text-[#9AA0A6]">Faturamento</div>
            </div>
            <div className="bg-[#F8F6F2] rounded-xl p-3">
              <div className="text-2xl font-bold text-[#FFA23B]">{todayMetrics.efficiency.toFixed(1)}</div>
              <div className="text-xs text-[#9AA0A6]">Nota Eficiência</div>
            </div>
          </div>
        </div>
      )}

      {/* Past Sessions */}
      <h3 className="font-semibold text-[#2B2620] mb-3 flex items-center gap-2">
        <History size={16} /> Histórico
      </h3>
      <div className="space-y-2">
        {sessions.filter((s) => s.closed_at).sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime()).slice(0, 10).map((session) => (
          <div key={session.id} className="bg-white rounded-2xl p-4 border border-[#EEE9E2]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-[#2B2620]">{formatDate(session.session_date)}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9AA0A6]">{session.total_orders} pedidos</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  (session.efficiency_score || 0) >= 4 ? "bg-[#E8F5E9] text-[#00C853]" :
                  (session.efficiency_score || 0) >= 3 ? "bg-[#FFF8E1] text-[#FFA23B]" : "bg-[#FFF0EC] text-[#D64550]"
                }`}>
                  {(session.efficiency_score || 0).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="text-xs text-[#9AA0A6]">
              {formatTime(session.opened_at)} - {session.closed_at ? formatTime(session.closed_at) : "agora"} • {formatCurrency(session.total_revenue)}
            </div>
            {session.location && (
              <div className="text-xs text-[#5C5850] mt-1 flex items-center gap-1">
                <MapPin size={10} /> {session.location.address || `Hortolândia, SP`}
              </div>
            )}
          </div>
        ))}
        {sessions.filter((s) => s.closed_at).length === 0 && (
          <div className="text-center text-[#9AA0A6] text-sm py-8">Nenhum dia registrado ainda.</div>
        )}
      </div>
    </div>
  );
}

// ============ New Order Modal ============

function NewOrderModal({
  onClose,
  onSubmit,
  menuItems,
  activeSession,
}: {
  onClose: () => void;
  onSubmit: (name: string, cart: { menuId: string; qty: number }[], priority: boolean) => void;
  menuItems: MenuItem[];
  activeSession: DailySessionWithDetails | null;
}) {
  const [name, setName] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [priority, setPriority] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const cartList = Object.entries(cart).filter(([, q]) => q > 0);
  const setQty = (id: string, d: number) => setCart((p) => ({ ...p, [id]: Math.max(0, (p[id] || 0) + d) }));

  const groupedMenu = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    menuItems.filter((m) => m.active).forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [menuItems]);

  const total = cartList.reduce((sum, [menuId, qty]) => {
    const item = menuItems.find((m) => m.id === menuId);
    return sum + (item?.price || 0) * qty;
  }, 0);

  const handleSubmit = async () => {
    if (!name.trim() || cartList.length === 0) return;
    setSubmitting(true);
    await onSubmit(name.trim(), cartList.map(([menuId, qty]) => ({ menuId, qty })), priority);
    setSubmitting(false);
  };

  if (!activeSession) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-20">
        <div className="w-full max-w-sm bg-white rounded-t-3xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-lg">Novo pedido</span>
            <button onClick={onClose}><X size={22} /></button>
          </div>
          <div className="bg-[#FFF0EC] rounded-xl p-4 text-center">
            <AlertTriangle className="mx-auto text-[#D64550] mb-2" size={32} />
            <p className="text-sm text-[#D64550]">Você precisa iniciar o dia antes de fazer pedidos.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-20">
      <div className="w-full max-w-sm bg-white rounded-t-3xl p-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-lg">Novo pedido</span>
          <button onClick={onClose}><X size={22} /></button>
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do cliente" className="w-full border border-[#EEE9E2] rounded-xl px-3 py-2.5 text-sm mb-3 outline-none focus:border-[#FF6B35]" />

        {Object.entries(groupedMenu).map(([category, items]) => (
          <div key={category} className="mb-3">
            <div className="text-xs font-semibold text-[#9AA0A6] uppercase tracking-wider mb-1.5">{CATEGORY_LABELS[category] || category}</div>
            <div className="space-y-1.5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-[#F8F6F2] rounded-lg px-2 py-1.5">
                  <div className="flex-1">
                    <div className="text-sm text-[#2B2620]">{item.name}</div>
                    <div className="text-xs text-[#9AA0A6]">{formatCurrency(item.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(item.id, -1)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm"><Minus size={12} /></button>
                    <span className="text-sm w-4 text-center font-medium">{cart[item.id] || 0}</span>
                    <button onClick={() => setQty(item.id, 1)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm"><Plus size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <label className="flex items-center gap-2 mb-3 text-sm">
          <input type="checkbox" checked={priority} onChange={(e) => setPriority(e.target.checked)} className="rounded" />
          <span className="text-[#5C5850]">Pedido prioritário</span>
        </label>

        {cartList.length > 0 && (
          <div className="bg-[#F8F6F2] rounded-xl p-3 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#2B2620]">Total</span>
              <span className="text-lg font-bold text-[#FF6B35]">{formatCurrency(total)}</span>
            </div>
          </div>
        )}

        <button onClick={handleSubmit} disabled={!name.trim() || cartList.length === 0 || submitting} className="w-full bg-[#FF6B35] disabled:bg-[#F1EEE7] disabled:text-[#9AA0A6] text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2">
          {submitting && <Loader2 size={18} className="animate-spin" />}
          Enviar pedido
        </button>
      </div>
    </div>
  );
}

// ============ Main App ============

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [screen, setScreen] = useState<"pedidos" | "estoque" | "menu" | "historico">("pedidos");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sessions, setSessions] = useState<DailySessionWithDetails[]>([]);
  const [now, setNow] = useState(Date.now());
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queueAlert, setQueueAlert] = useState<{ orderId: string; alert: QueueAlertData } | null>(null);
  const [pendingAdvance, setPendingAdvance] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [invRes, ordersRes, menuRes, recipesRes, sessionsRes] = await Promise.all([
        supabase.from("inventory").select("*").order("name"),
        supabase.from("orders").select("*, items:order_items(*)").order("created_at", { ascending: false }),
        supabase.from("menu_items").select("*").order("category, name"),
        supabase.from("recipes").select("*"),
        supabase.from("daily_sessions").select("*, location:locations(*)").order("session_date", { ascending: false }),
      ]);

      if (invRes.error) throw invRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (menuRes.error) throw menuRes.error;
      if (recipesRes.error) throw recipesRes.error;
      if (sessionsRes.error) throw sessionsRes.error;

      setInventory(invRes.data || []);
      setOrders((ordersRes.data || []) as OrderWithItems[]);
      setMenuItems(menuRes.data || []);
      setRecipes(recipesRes.data || []);
      setSessions((sessionsRes.data || []) as DailySessionWithDetails[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showWelcome) {
      fetchData();
    }
  }, [fetchData, showWelcome]);

  useEffect(() => {
    const invChannel = supabase.channel("inventory-changes").on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, (payload) => {
      if (payload.eventType === "UPDATE") {
        setInventory((prev) => prev.map((item) => (item.id === payload.new.id ? (payload.new as InventoryItem) : item)));
      }
    }).subscribe();

    const ordersChannel = supabase.channel("orders-changes").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, async (payload) => {
      if (payload.eventType === "INSERT") {
        const { data: items } = await supabase.from("order_items").select("*").eq("order_id", payload.new.id);
        setOrders((prev) => [{ ...(payload.new as OrderWithItems), items: items || [] }, ...prev]);
      } else if (payload.eventType === "UPDATE") {
        setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? { ...o, ...(payload.new as Order) } : o)));
      } else if (payload.eventType === "DELETE") {
        setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
      }
    }).subscribe();

    return () => {
      supabase.removeChannel(invChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const activeSession = sessions.find((s) => s.session_date === todayStr && !s.closed_at);
  const dayActive = !!activeSession;

  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.created_at).toISOString().split("T")[0];
    return orderDate === todayStr;
  });

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== "entregue").sort((a, b) => {
      if (a.priority !== b.priority) return b.priority ? 1 : -1;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }),
    [orders]
  );

  const preparing = activeOrders.filter((o) => o.status === "em_preparo").length;
  const waiting = activeOrders.filter((o) => o.status === "recebido").length;
  const bottlenecked = activeOrders.filter((o) => o.status !== "pronto" && now - new Date(o.created_at).getTime() > BOTTLENECK_MS);
  const lowStock = inventory.filter((v) => v.qty <= v.threshold);

  const deductInventory = useCallback(async (order: OrderWithItems) => {
    for (const { menu_id, qty } of order.items) {
      const itemRecipes = recipes.filter((r) => r.menu_id === menu_id);
      for (const recipe of itemRecipes) {
        const inv = inventory.find((i) => i.id === recipe.inventory_id);
        if (inv) {
          await supabase.from("inventory").update({ qty: Math.max(0, inv.qty - recipe.quantity * qty) }).eq("id", inv.id);
        }
      }
    }
  }, [recipes, inventory]);

  const addOrder = useCallback(async (customerName: string, cart: { menuId: string; qty: number }[], priority: boolean) => {
    const { data: order, error: orderError } = await supabase.from("orders").insert({ customer_name: customerName, priority, session_id: activeSession?.id || null }).select().single();
    if (orderError || !order) { setError("Failed to create order"); return; }

    const orderItems = cart.map(({ menuId, qty }) => ({ order_id: order.id, menu_id: menuId, qty }));
    await supabase.from("order_items").insert(orderItems);
    setOrders((prev) => [{ ...order, items: orderItems as OrderItem[] } as OrderWithItems, ...prev]);
    setShowNew(false);
  }, [activeSession]);

  const checkQueueOrder = useCallback((orderId: string): QueueAlertData | null => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== "recebido") return null;

    const skippedOrders = orders.filter((o) => o.status === "recebido" && o.number < order.number);
    if (skippedOrders.length === 0) return null;

    const skipped = skippedOrders.sort((a, b) => a.number - b.number)[0];
    return {
      skippedOrderId: skipped.id,
      skippedOrderNumber: skipped.number,
      skippedCustomerName: skipped.customer_name,
      waitTimeMs: now - new Date(skipped.created_at).getTime(),
    };
  }, [orders, now]);

  const advanceOrder = useCallback(async (id: string, skipAlert = false) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    const currentStatus = STATUS_CONFIG[order.status];
    if (!currentStatus?.next) return;

    if (currentStatus.next === "em_preparo" && !skipAlert) {
      const alert = checkQueueOrder(id);
      if (alert) { setQueueAlert({ orderId: id, alert }); setPendingAdvance(id); return; }
    }

    const updateData: Record<string, unknown> = { status: currentStatus.next };
    if (currentStatus.next === "em_preparo") {
      updateData.started_at = new Date().toISOString();
      await deductInventory(order);
    } else if (currentStatus.next === "pronto") {
      updateData.completed_at = new Date().toISOString();
    }

    await supabase.from("orders").update(updateData).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updateData } : o)));
  }, [orders, deductInventory, checkQueueOrder]);

  const handleAlertContinue = useCallback(() => {
    if (pendingAdvance) advanceOrder(pendingAdvance, true);
    setQueueAlert(null);
    setPendingAdvance(null);
  }, [pendingAdvance, advanceOrder]);

  const handleAlertCancel = useCallback(() => {
    setQueueAlert(null);
    setPendingAdvance(null);
  }, []);

  const startDay = useCallback(async () => {
    const fakeLoc = getRandomLocation();
    const { data: location } = await supabase.from("locations").insert({ latitude: fakeLoc.lat, longitude: fakeLoc.lng, address: fakeLoc.address }).select().single();
    const { data: session } = await supabase.from("daily_sessions").insert({ session_date: todayStr, location_id: location?.id }).select("*, location:locations(*)").single();
    if (session) setSessions((prev) => [session as DailySessionWithDetails, ...prev]);
  }, [todayStr]);

  const endDay = useCallback(async () => {
    if (!activeSession) return;

    const deliveredToday = orders.filter((o) => {
      const orderDate = new Date(o.created_at).toISOString().split("T")[0];
      return orderDate === todayStr && o.status === "entregue";
    });

    const prepTimes = deliveredToday.filter((o) => o.started_at && o.completed_at).map((o) => new Date(o.completed_at!).getTime() - new Date(o.started_at!).getTime());
    const avgPrepTime = prepTimes.length > 0 ? Math.round(prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length) : null;

    let efficiencyScore = 0;
    if (prepTimes.length > 0 && avgPrepTime) {
      const idealTimes = deliveredToday.map((o) => Math.max(...o.items.map((item) => menuItems.find((m) => m.id === item.menu_id)?.prep_time_seconds || 300)));
      const avgIdeal = idealTimes.reduce((a, b) => a + b, 0) / idealTimes.length;
      const ratio = avgIdeal / avgPrepTime;
      efficiencyScore = Math.min(5, Math.max(0, ratio * 5));
    }

    const totalRevenue = deliveredToday.reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + (menuItems.find((m) => m.id === item.menu_id)?.price || 0) * item.qty, 0), 0);

    await supabase.from("daily_sessions").update({
      closed_at: new Date().toISOString(),
      total_orders: deliveredToday.length,
      total_revenue: totalRevenue,
      avg_prep_time_seconds: avgPrepTime,
      efficiency_score: Math.round(efficiencyScore * 100) / 100,
    }).eq("id", activeSession.id);

    fetchData();
  }, [activeSession, orders, todayStr, menuItems, fetchData]);

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  if (loading) {
    return <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-[#D64550] mx-auto mb-2" />
          <p className="text-[#D64550] font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#FF6B35] text-white rounded-lg">Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex justify-center">
      <div className="w-full max-w-sm min-h-screen bg-[#FAFAF8] relative pb-20">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

        {/* Header */}
        <header className="sticky top-0 bg-[#FAFAF8] z-10 px-4 pt-4 pb-3 flex items-center justify-between border-b border-[#EEE9E2]">
          <div className="flex items-center gap-2">
            <Mascot size={40} />
            <span className="font-extrabold text-lg text-[#2B2620]" style={{ fontFamily: "'Poppins', sans-serif" }}>Grelha</span>
          </div>
          {screen === "pedidos" && (
            <button onClick={() => setShowNew(true)} className="bg-[#FF6B35] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-md active:scale-95 transition-transform">
              <Plus size={22} />
            </button>
          )}
        </header>

        {screen === "pedidos" && <MonitoringWidget preparing={preparing} waiting={waiting} />}
        {screen === "pedidos" && <PedidosScreen orders={activeOrders} now={now} onAdvance={advanceOrder} bottlenecked={bottlenecked} />}
        {screen === "estoque" && <EstoqueScreen inventory={inventory} lowStock={lowStock} />}
        {screen === "menu" && <MenuManagementScreen menuItems={menuItems} recipes={recipes} inventory={inventory} onRefresh={fetchData} />}
        {screen === "historico" && <HistoryScreen sessions={sessions} todayOrders={todayOrders} onStartDay={startDay} onEndDay={endDay} dayActive={dayActive} />}

        {showNew && <NewOrderModal onClose={() => setShowNew(false)} onSubmit={addOrder} menuItems={menuItems} activeSession={activeSession || null} />}
        {queueAlert && <QueueAlertModal alert={queueAlert.alert} onContinue={handleAlertContinue} onCancel={handleAlertCancel} />}

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-[#EEE9E2] grid grid-cols-4">
          {[
            ["pedidos", "Pedidos", ClipboardList, bottlenecked.length + waiting],
            ["estoque", "Estoque", Package, lowStock.length],
            ["menu", "Cardápio", UtensilsCrossed, 0],
            ["historico", "Dia", History, 0],
          ].map(([id, label, Icon, badge]) => (
            <button key={id as string} onClick={() => setScreen(id as typeof screen)} className={`flex flex-col items-center gap-0.5 py-2.5 relative font-medium text-[10px] ${screen === id ? "text-[#FF6B35]" : "text-[#9AA0A6]"}`}>
              <Icon size={20} strokeWidth={screen === id ? 2.5 : 2} />
              {label as string}
              {(badge as number) > 0 && <span className="absolute top-1.5 right-1/4 bg-[#E53935] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{badge}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
