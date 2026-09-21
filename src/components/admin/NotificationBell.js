"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Bell, BellOff, Volume2, VolumeX, CheckCheck } from "lucide-react";

const POLL_MS = 30000; // refresh every 30s
const MUTE_KEY = "sara_notif_mute";

// Soft "ding" using WebAudio (no audio file needed).
function playDing() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const t0 = ctx.currentTime;
    [880, 1174.66].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t0 + i * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + i * 0.16 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.16 + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0 + i * 0.16);
      osc.stop(t0 + i * 0.16 + 0.35);
    });
  } catch {}
}

function timeAgo(iso) {
  try {
    const mins = Math.max(0, Math.floor((Date.now() - new Date(iso)) / 60000));
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins.toLocaleString("ar-EG")} د`;
    const h = Math.floor(mins / 60);
    if (h < 24) return `منذ ${h.toLocaleString("ar-EG")} س`;
    return `منذ ${Math.floor(h / 24).toLocaleString("ar-EG")} يوم`;
  } catch {
    return "";
  }
}

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const ref = useRef(null);
  const prevUnread = useRef(0);
  const firstLoad = useRef(true);

  useEffect(() => {
    try {
      setMuted(localStorage.getItem(MUTE_KEY) === "1");
    } catch {}
  }, []);

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications?limit=8", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items || []);
      setUnread(data.unread || 0);
      // Ding only when NEW unread arrives (not on first load).
      if (!firstLoad.current && (data.unread || 0) > prevUnread.current) {
        let isMuted = false;
        try {
          isMuted = localStorage.getItem(MUTE_KEY) === "1";
        } catch {}
        if (!isMuted) playDing();
      }
      prevUnread.current = data.unread || 0;
      firstLoad.current = false;
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifs();
    const id = setInterval(fetchNotifs, POLL_MS);
    return () => clearInterval(id);
  }, [fetchNotifs]);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {}
  }

  async function markAllRead() {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setItems((list) => list.map((n) => ({ ...n, is_read: true })));
      setUnread(0);
      prevUnread.current = 0;
    } catch {}
  }

  function markOneRead(id) {
    setItems((list) => list.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnread((u) => {
      const next = Math.max(0, u - 1);
      prevUnread.current = next;
      return next;
    });
    fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    }).catch(() => {});
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="التنبيهات"
        className="relative p-2 rounded-full hover:bg-pastel-pink/30 text-warm-mocha transition"
      >
        {muted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
        {unread > 0 && (
          <span className="absolute -top-0.5 -left-0.5 min-w-[1.15rem] h-[1.15rem] px-1 grid place-items-center rounded-full bg-soft-rose text-white text-[0.65rem] font-black">
            {unread > 9 ? "9+" : unread.toLocaleString("ar-EG")}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 max-w-[85vw] bg-white rounded-2xl shadow-soft border border-pastel-pink/50 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-pastel-pink/40">
            <span className="font-black text-warm-mocha text-sm">التنبيهات 🔔</span>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMute}
                aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
                className="p-1.5 rounded-lg hover:bg-cream text-warm-mocha/60"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={markAllRead}
                aria-label="تحديد الكل كمقروء"
                className="p-1.5 rounded-lg hover:bg-cream text-warm-mocha/60"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 && (
              <p className="text-center text-sm font-bold text-warm-mocha/50 py-8">
                لا توجد تنبيهات بعد 🌸
              </p>
            )}
            {items.map((n) => (
              <Link
                key={n.id}
                href={n.link || "/admin"}
                onClick={() => {
                  markOneRead(n.id);
                  setOpen(false);
                }}
                className={`block px-4 py-3 border-b border-pastel-pink/30 last:border-0 hover:bg-cream/70 transition ${
                  n.is_read ? "" : "bg-pastel-pink/15"
                }`}
              >
                <p className="font-black text-warm-mocha text-sm flex items-center gap-2">
                  {!n.is_read && <span className="w-2 h-2 rounded-full bg-soft-rose shrink-0" />}
                  {n.title_ar}
                </p>
                {n.body_ar && (
                  <p className="text-xs font-bold text-warm-mocha/60 mt-0.5 line-clamp-2">
                    {n.body_ar}
                  </p>
                )}
                <p className="text-[0.65rem] font-bold text-warm-mocha/40 mt-1">
                  {timeAgo(n.created_at)}
                </p>
              </Link>
            ))}
          </div>

          <Link
            href="/admin/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-sm font-black text-soft-rose py-2.5 bg-cream/60 hover:bg-cream transition"
          >
            عرض كل التنبيهات
          </Link>
        </div>
      )}
    </div>
  );
}
