import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { PRODUCTS } from "./config.js";
import { linePrice, minQty, checkLine, sizeLabel } from "./lib.js";

const KEY = "nc-cart-v1";
const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

function load() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; } catch { return []; }
}

const same = (a, b) => a.id === b.id && a.size === b.size;
function reducer(items, a) {
  switch (a.type) {
    case "add": return items.some((x) => same(x, a))
      ? items.map((x) => (same(x, a) ? { ...x, qty: x.qty + a.qty } : x))
      : [...items, { id: a.id, size: a.size, qty: a.qty }];
    case "set": return items.map((x) => (same(x, a) ? { ...x, qty: a.qty } : x));
    case "remove": return items.filter((x) => !same(x, a));
    case "clear": return [];
    default: return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], load);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* abaikan */ } }, [items]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Produk berbeda ukuran kemasan = baris berbeda. Produk yang sudah dihapus dari config tidak ditampilkan.
  const lines = useMemo(() => items.map((it) => {
    const p = PRODUCTS.find((x) => x.id === it.id);
    return p ? { ...it, p, ...linePrice(p, it.size, it.qty), error: checkLine(p, it.size, it.qty) } : null;
  }).filter(Boolean), [items]);

  const value = {
    lines, open, setOpen, toast,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.total, 0),
    add(p, size, qty = 1) {
      dispatch({ type: "add", id: p.id, size, qty: Math.max(qty, minQty(p, size)) });
      setToast(`${p.name} (${sizeLabel(size)}) ditambahkan ke keranjang`);
    },
    setQty(l, qty) { dispatch({ type: "set", id: l.id, size: l.size, qty: Math.max(qty, minQty(l.p, l.size)) }); },
    remove(l) { dispatch({ type: "remove", id: l.id, size: l.size }); },
    clear() { dispatch({ type: "clear" }); }
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
