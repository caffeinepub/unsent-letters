import { Toaster } from "@/components/ui/sonner";
import { Mail, Music, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── types ────────────────────────────────────────────────────────────────────

type Message = {
  id: number;
  to: string;
  message: string;
  song: string;
  color: string;
  timestamp: number;
};

// ─── seed data ────────────────────────────────────────────────────────────────

const SEED_MESSAGES: Message[] = [
  {
    id: 1,
    to: "sarah",
    message:
      "i never told you how much your laugh meant to me. i still hear it sometimes when the world gets too quiet.",
    song: "the night we met - lord huron",
    color: "#c9b8e8",
    timestamp: Date.now() - 86400000 * 5,
  },
  {
    id: 2,
    to: "marco",
    message:
      "i should have stayed. i was scared and i left and i've regretted it every single day since.",
    song: "someone like you - adele",
    color: "#f4b8c8",
    timestamp: Date.now() - 86400000 * 12,
  },
  {
    id: 3,
    to: "grandpa joe",
    message:
      "you taught me how to be brave. i just wish i had said thank you before it was too late.",
    song: "fix you - coldplay",
    color: "#b8d4f4",
    timestamp: Date.now() - 86400000 * 20,
  },
  {
    id: 4,
    to: "mochi",
    message:
      "you were the best dog. the house is so quiet without you. i hope wherever you are, there are endless fields.",
    song: "fast car - tracy chapman",
    color: "#b8e8c9",
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: 5,
    to: "jess",
    message:
      "you were my best friend. i don't know what went wrong between us. i miss you more than i miss any lover i've ever had.",
    song: "back to december - taylor swift",
    color: "#f4d4b8",
    timestamp: Date.now() - 86400000 * 8,
  },
  {
    id: 6,
    to: "mom",
    message:
      "i know we didn't always see eye to eye. but i want you to know — you did your best and i see that now.",
    song: "the scientist - coldplay",
    color: "#e8d4b8",
    timestamp: Date.now() - 86400000 * 1,
  },
  {
    id: 7,
    to: "alex",
    message:
      "we were 17 and the whole world felt like ours. i hope you still feel that way sometimes.",
    song: "golden hour - kacey musgraves",
    color: "#f4b8e4",
    timestamp: Date.now() - 86400000 * 30,
  },
  {
    id: 8,
    to: "myself",
    message:
      "you survived. you're still here. that's enough. that will always be enough.",
    song: "three little birds - bob marley",
    color: "#b8e8e4",
    timestamp: Date.now() - 86400000 * 2,
  },
];

// ─── color presets ────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  "#c9b8e8", // pastel lavender
  "#f4b8c8", // pastel rose
  "#b8d4f4", // pastel blue
  "#b8e8c9", // pastel mint
  "#f4d4b8", // pastel peach
  "#e8d4b8", // pastel sand
  "#f4b8e4", // pastel pink
  "#b8e8e4", // pastel teal
  "#e8e8b8", // pastel yellow
  "#d4b8f4", // pastel purple
  "#f4c8b8", // pastel coral
  "#b8c8e8", // pastel periwinkle
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function getContrastColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.45 ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.92)";
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "a month ago";
  return `${months} months ago`;
}

// ─── compose modal ────────────────────────────────────────────────────────────

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (msg: Omit<Message, "id" | "timestamp">) => void;
}

function ComposeModal({ open, onClose, onSubmit }: ComposeModalProps) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [song, setSong] = useState("");
  const [color, setColor] = useState(COLOR_PRESETS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || !message.trim()) return;
    onSubmit({
      to: to.trim(),
      message: message.trim(),
      song: song.trim(),
      color,
    });
    setTo("");
    setMessage("");
    setSong("");
    setColor(COLOR_PRESETS[0]);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            data-ocid="compose.dialog"
            className="relative w-full max-w-lg border border-[oklch(0.78_0.06_75)] bg-[oklch(0.98_0.008_75)] p-6 md:p-8"
            style={{
              boxShadow:
                "0 4px 40px oklch(0.80_0.12_350 / 0.12), 0 2px 12px rgba(0,0,0,0.08)",
            }}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="vhs-title text-2xl neon-text-pink">
                a letter, unsent.
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* to */}
              <div>
                <label
                  htmlFor="compose-to"
                  className="block text-xs text-muted-foreground mb-1.5 tracking-widest"
                >
                  to:
                </label>
                <input
                  id="compose-to"
                  data-ocid="compose.to.input"
                  className="retro-input"
                  placeholder="their name..."
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>

              {/* message */}
              <div>
                <label
                  htmlFor="compose-message"
                  className="block text-xs text-muted-foreground mb-1.5 tracking-widest"
                >
                  your message:
                </label>
                <textarea
                  id="compose-message"
                  data-ocid="compose.message.textarea"
                  className="retro-input resize-none"
                  placeholder="say the things you never could..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {/* song */}
              <div>
                <label
                  htmlFor="compose-song"
                  className="block text-xs text-muted-foreground mb-1.5 tracking-widest"
                >
                  <Music size={10} className="inline mr-1" />
                  dedicate a song:
                </label>
                <input
                  id="compose-song"
                  data-ocid="compose.song.input"
                  className="retro-input"
                  placeholder="song name or spotify/apple music url..."
                  value={song}
                  onChange={(e) => setSong(e.target.value)}
                  autoComplete="off"
                />
              </div>

              {/* color picker */}
              <div>
                <p className="block text-xs text-muted-foreground mb-2.5 tracking-widest">
                  pick a color — the feeling of them:
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`color-swatch ${color === c ? "selected" : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                      aria-label={`select color ${c}`}
                    />
                  ))}
                  <label className="color-swatch flex items-center justify-center text-xs text-white/70 bg-white/5 border border-white/20 cursor-pointer hover:border-white/50 transition-colors">
                    <input
                      data-ocid="compose.color.input"
                      type="color"
                      className="opacity-0 absolute w-0 h-0"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                    <span style={{ fontSize: "1rem" }}>+</span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-sm border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground">{color}</span>
                </div>
              </div>

              {/* submit */}
              <button
                data-ocid="compose.submit_button"
                type="submit"
                className="retro-button-primary w-full mt-2"
              >
                send it into the void
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── message detail modal ─────────────────────────────────────────────────────

interface DetailModalProps {
  message: Message | null;
  onClose: () => void;
}

function DetailModal({ message, onClose }: DetailModalProps) {
  if (!message) return null;

  const textColor = getContrastColor(message.color);
  const isSongUrl = message.song.startsWith("http");

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            data-ocid="message.dialog"
            className="relative w-full max-w-md overflow-hidden"
            style={{
              backgroundColor: message.color,
              boxShadow: `0 0 40px ${message.color}50, 0 0 80px ${message.color}25`,
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* scanlines on modal */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
              }}
            />

            <div className="relative p-8">
              {/* close button */}
              <button
                type="button"
                data-ocid="message.close_button"
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-sm transition-opacity hover:opacity-70"
                style={{ color: textColor }}
                aria-label="close"
              >
                <X size={18} />
              </button>

              {/* to */}
              <p
                className="text-xs font-bold tracking-widest mb-4 opacity-70"
                style={{
                  color: textColor,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                to:
              </p>
              <h2
                className="text-3xl font-black tracking-tight mb-6"
                style={{
                  color: textColor,
                  fontFamily: "'Courier New', monospace",
                  lineHeight: 1,
                }}
              >
                {message.to}
              </h2>

              {/* message */}
              <p
                className="text-sm leading-relaxed mb-8 whitespace-pre-line"
                style={{
                  color: textColor,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {message.message}
              </p>

              {/* song */}
              {message.song && (
                <div className="flex items-start gap-2">
                  <Music
                    size={13}
                    className="mt-0.5 shrink-0"
                    style={{ color: textColor, opacity: 0.7 }}
                  />
                  {isSongUrl ? (
                    <a
                      href={message.song}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs italic underline underline-offset-2"
                      style={{ color: textColor, opacity: 0.85 }}
                    >
                      {message.song}
                    </a>
                  ) : (
                    <span
                      className="text-xs italic"
                      style={{ color: textColor, opacity: 0.85 }}
                    >
                      {message.song}
                    </span>
                  )}
                </div>
              )}

              {/* timestamp */}
              <p
                className="text-xs mt-6 opacity-50"
                style={{
                  color: textColor,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {timeAgo(message.timestamp)}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── message tile ─────────────────────────────────────────────────────────────

interface TileProps {
  message: Message;
  index: number;
  onClick: () => void;
}

function MessageTile({ message, index, onClick }: TileProps) {
  const textColor = getContrastColor(message.color);
  const snippet =
    message.message.length > 90
      ? `${message.message.slice(0, 90)}…`
      : message.message;

  return (
    <motion.div
      data-ocid={`messages.item.${index}`}
      className="message-tile"
      style={{
        backgroundColor: message.color,
        color: textColor,
        boxShadow: `0 4px 20px ${message.color}30, 0 2px 8px rgba(0,0,0,0.4)`,
      }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{
        y: -4,
        boxShadow: `0 8px 30px ${message.color}50, 0 4px 12px rgba(0,0,0,0.5)`,
      }}
    >
      <div className="tile-to" style={{ color: textColor }}>
        to: {message.to}
      </div>
      <div className="tile-message" style={{ color: textColor }}>
        {snippet}
      </div>
      {message.song && (
        <div
          className="tile-song flex items-center gap-1.5"
          style={{ color: textColor }}
        >
          <Music size={10} />
          {message.song}
        </div>
      )}
    </motion.div>
  );
}

// ─── main app ─────────────────────────────────────────────────────────────────

export default function App() {
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [search, setSearch] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return messages;
    const q = search.trim().toLowerCase();
    return messages.filter(
      (m) =>
        m.to.toLowerCase().includes(q) || m.message.toLowerCase().includes(q),
    );
  }, [messages, search]);

  const handleSubmit = (data: Omit<Message, "id" | "timestamp">) => {
    const newMsg: Message = {
      ...data,
      id: Date.now(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [newMsg, ...prev]);
    setComposeOpen(false);
    toast("your letter has been sent.", {
      description: `to: ${data.to}`,
      duration: 4000,
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen relative">
      {/* ambient pastel background blobs */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.80 0.12 350 / 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.76 0.12 300 / 0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="fixed top-1/2 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.80 0.10 162 / 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* header */}
      <header className="sticky top-0 z-30 border-b border-border backdrop-blur-sm bg-background/90">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex-shrink-0">
            <span className="vhs-title text-xl neon-text-pink animate-flicker">
              unsent
            </span>
          </div>

          {/* search */}
          <div className="flex-1 relative max-w-md">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              data-ocid="search.input"
              className="retro-input pl-8 py-2 text-sm"
              placeholder="search for a name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>

          <button
            type="button"
            data-ocid="compose.open_modal_button"
            onClick={() => setComposeOpen(true)}
            className="retro-button-primary hidden md:block text-sm px-4 py-2 whitespace-nowrap"
          >
            <Mail size={13} className="inline mr-1.5" />
            write a letter ✉
          </button>
        </div>
      </header>

      {/* hero section */}
      <main>
        <section className="text-center pt-12 pb-8 px-4">
          {/* cassette */}
          <button
            type="button"
            className="cassette-wrapper inline-block mb-6 animate-float-up cursor-pointer bg-transparent border-0 p-0"
            onClick={() => setComposeOpen(true)}
            aria-label="open compose — write a letter"
          >
            <motion.img
              src="/assets/uploads/cassette.jpg"
              alt="retro cassette tape"
              className="w-full max-w-sm md:max-w-md mx-auto drop-shadow-2xl"
              style={{
                filter:
                  "drop-shadow(0 4px 24px oklch(0.80 0.12 350 / 0.25)) drop-shadow(0 2px 8px rgba(0,0,0,0.10))",
              }}
              whileHover={{ scale: 1.03, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </button>

          {/* title */}
          <motion.h1
            className="vhs-title mb-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="neon-text-pink">un</span>
            <span className="text-foreground">sent</span>
          </motion.h1>

          {/* tagline */}
          <motion.p
            className="tagline neon-text-cyan mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            say the things you never said.
          </motion.p>
          <motion.p
            className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            a quiet space for unspoken words.
            <br />
            click the cassette — or search your name.
          </motion.p>
        </section>

        {/* message collage */}
        <section className="max-w-6xl mx-auto px-4 pb-28">
          {/* section header */}
          {search && (
            <div className="mb-6 text-sm text-muted-foreground">
              {filtered.length > 0 ? (
                <span>
                  {filtered.length} letter{filtered.length !== 1 ? "s" : ""}{" "}
                  addressed to{" "}
                  <span className="neon-text-pink">"{search}"</span>
                </span>
              ) : null}
            </div>
          )}

          {/* empty state */}
          {filtered.length === 0 && (
            <motion.div
              data-ocid="messages.empty_state"
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-4xl mb-4 opacity-40">✉</p>
              <p className="text-muted-foreground text-sm">
                no letters found for{" "}
                <span className="neon-text-pink">"{search}"</span>
              </p>
              <p className="text-muted-foreground text-xs mt-2 opacity-60">
                maybe yours hasn't been sent yet.
              </p>
            </motion.div>
          )}

          {/* masonry-ish grid */}
          {filtered.length > 0 && (
            <div
              style={{
                columns: "var(--cols, 2)",
                columnGap: "1rem",
                // responsive via inline style trick
              }}
              className="[--cols:1] sm:[--cols:2] md:[--cols:3] lg:[--cols:4]"
            >
              {filtered.map((msg, i) => (
                <div
                  key={msg.id}
                  style={{ marginBottom: "1rem", breakInside: "avoid" }}
                >
                  <MessageTile
                    message={msg}
                    index={i + 1}
                    onClick={() => setSelectedMessage(msg)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* floating compose button (mobile) */}
      <motion.button
        data-ocid="compose.open_modal_button"
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden retro-button-primary px-6 py-3 z-30 flex items-center gap-2"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <Mail size={14} />
        write a letter ✉
      </motion.button>

      {/* footer */}
      <footer className="border-t border-border/40 py-6 text-center">
        <p className="text-xs text-muted-foreground/60">
          © {currentYear}. built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
        <p className="text-xs text-muted-foreground/40 mt-1">by azi</p>
      </footer>

      {/* modals */}
      <ComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSubmit={handleSubmit}
      />

      <DetailModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "oklch(0.98 0.008 75)",
            border: "1.5px solid oklch(0.80 0.12 350 / 0.5)",
            color: "oklch(0.28 0.04 270)",
            fontFamily: "'Courier New', monospace",
            fontSize: "0.85rem",
            textTransform: "lowercase",
            boxShadow: "0 4px 16px oklch(0.80 0.12 350 / 0.15)",
          },
        }}
      />
    </div>
  );
}
