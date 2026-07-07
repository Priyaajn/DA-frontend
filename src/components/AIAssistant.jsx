import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContextProvider";

// ─── Markdown renderer: **bold** + newlines ───────────────────────────
const FormattedMsg = ({ text }) => (
  <div>
    {text.split("\n").map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: "6px" }} />;
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} style={{ margin: "0 0 3px", lineHeight: "1.55", fontSize: "13px" }}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} style={{ fontWeight: 700 }}>{part}</strong>
              : <span key={j}>{part}</span>
          )}
        </p>
      );
    })}
  </div>
);

const QUICK = ["Headache", "Cold 🤧", "Fever 🌡️", "Stomach pain", "Cough 😷", "Fatigue 😔"];

// ─── Pulse animation keyframes injected once ─────────────────────────
const injectStyles = () => {
  if (document.getElementById("ai-chat-styles")) return;
  const style = document.createElement("style");
  style.id = "ai-chat-styles";
  style.innerHTML = `
    @keyframes aiBounce {
      0%,80%,100% { transform: translateY(0); }
      40%          { transform: translateY(-5px); }
    }
    @keyframes aiPulse {
      0%,100% { opacity:1; }
      50%     { opacity:.4; }
    }
    @keyframes aiSlideUp {
      from { opacity:0; transform: translateY(20px) scale(.97); }
      to   { opacity:1; transform: translateY(0)   scale(1);    }
    }
    @keyframes aiFadeIn {
      from { opacity:0; transform: translateY(6px); }
      to   { opacity:1; transform: translateY(0);   }
    }
    .ai-msg-enter { animation: aiFadeIn .25s ease forwards; }
    .ai-quick-btn:hover { background:#1d4ed8 !important; color:#fff !important; }
    .ai-send-btn:hover:not(:disabled) { background:#1d4ed8 !important; }
    .ai-close-btn:hover { background:rgba(255,255,255,.2) !important; }
    .ai-fab:hover { transform:scale(1.12); box-shadow:0 8px 32px rgba(37,99,235,.5) !important; }
    .ai-scroll::-webkit-scrollbar { width:4px; }
    .ai-scroll::-webkit-scrollbar-track { background:transparent; }
    .ai-scroll::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:4px; }
  `;
  document.head.appendChild(style);
};

export default function AIAssistant() {
  const { backendUrl } = useContext(AppContext);
  const [open,    setOpen]    = useState(false);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [unread,  setUnread]  = useState(0);
  const [messages, setMessages] = useState([{
    sender: "ai",
    text: "👋 Hello! I'm your **Prescripto Health Assistant**.\n\nTell me your symptoms and I'll suggest home remedies, medicines, and the right doctor! 😊\n\nTry saying:\n• 'I have a headache'\n• 'I have stomach pain'\n• 'I feel feverish'\n• 'I have a sore throat'",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }]);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 150); }
  }, [open]);

  const send = async (text) => {
    const txt = (text || input).trim();
    if (!txt) return;

    const userMsg = {
      sender: "user",
      text: txt,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/ai/chat`, {
        message: txt,
        userId: "guest",
      });
      const aiMsg = {
        sender: "ai",
        text: data.reply || "No response.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(p => [...p, aiMsg]);
      if (!open) setUnread(c => c + 1);
    } catch {
      setMessages(p => [...p, {
        sender: "ai",
        text: "Something went wrong. Please try again. 😕",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    }
    setLoading(false);
  };

  // ── Styles ────────────────────────────────────────────────────────
  const fabStyle = {
    position:     "fixed",
    bottom:       "24px",
    right:        "24px",
    zIndex:       9999,
    width:        "56px",
    height:       "56px",
    borderRadius: "50%",
    background:   "linear-gradient(135deg,#2563EB,#4f46e5)",
    border:       "none",
    cursor:       "pointer",
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
    fontSize:     "22px",
    color:        "#fff",
    boxShadow:    "0 4px 20px rgba(37,99,235,.4)",
    transition:   "transform .2s, box-shadow .2s",
  };

  const panelStyle = {
    position:     "fixed",
    bottom:       "92px",
    right:        "24px",
    zIndex:       9998,
    width:        "370px",
    height:       "560px",
    background:   "#fff",
    borderRadius: "20px",
    boxShadow:    "0 24px 64px rgba(0,0,0,.16)",
    border:       "1px solid #e2e8f0",
    display:      "flex",
    flexDirection:"column",
    overflow:     "hidden",
    fontFamily:   "'DM Sans',system-ui,sans-serif",
    animation:    "aiSlideUp .3s cubic-bezier(.34,1.56,.64,1) forwards",
  };

  return (
    <>
      {/* ── FAB Button ──────────────────────────────────────────── */}
      <button className="ai-fab" onClick={() => setOpen(o => !o)} style={fabStyle} title="Health Assistant">
        {open ? "✕" : "💬"}
        {/* Unread badge */}
        {!open && unread > 0 && (
          <span style={{
            position:"absolute", top:"-4px", right:"-4px",
            background:"#ef4444", color:"#fff",
            fontSize:"10px", fontWeight:700,
            width:"18px", height:"18px", borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            border:"2px solid #fff",
          }}>{unread}</span>
        )}
      </button>

      {/* ── Chat Panel ──────────────────────────────────────────── */}
      {open && (
        <div style={panelStyle}>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg,#1e3a8a 0%,#2563EB 60%,#4f46e5 100%)",
            padding:    "14px 16px",
            display:    "flex",
            alignItems: "center",
            gap:        "12px",
            flexShrink: 0,
          }}>
            {/* Avatar */}
            <div style={{
              width:"42px", height:"42px", borderRadius:"50%",
              background:"rgba(255,255,255,.15)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"20px", flexShrink:0, border:"2px solid rgba(255,255,255,.3)",
            }}>🏥</div>

            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontWeight:700, color:"#fff", fontSize:"14px", letterSpacing:".01em" }}>
                Prescripto Health AI
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"2px" }}>
                <span style={{
                  width:"7px", height:"7px", borderRadius:"50%", background:"#4ade80",
                  animation:"aiPulse 1.5s infinite",
                }} />
                <span style={{ color:"#93c5fd", fontSize:"11px" }}>Online — Ask me your symptoms</span>
              </div>
            </div>

            <button
              className="ai-close-btn"
              onClick={() => setOpen(false)}
              style={{
                background:"rgba(255,255,255,.1)", border:"none", color:"#fff",
                width:"28px", height:"28px", borderRadius:"50%",
                cursor:"pointer", fontSize:"14px", display:"flex",
                alignItems:"center", justifyContent:"center", transition:"background .2s",
              }}
            >✕</button>
          </div>

          {/* Messages */}
          <div
            className="ai-scroll"
            style={{
              flex:1, overflowY:"auto", padding:"14px 12px",
              background:"#f8fafc", display:"flex", flexDirection:"column", gap:"10px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className="ai-msg-enter"
                style={{
                  display:"flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  gap:"8px",
                  alignItems:"flex-end",
                }}
              >
                {msg.sender === "ai" && (
                  <div style={{
                    width:"28px", height:"28px", borderRadius:"50%",
                    background:"linear-gradient(135deg,#dbeafe,#ede9fe)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"14px", flexShrink:0,
                  }}>🏥</div>
                )}

                <div style={{ maxWidth:"80%" }}>
                  <div style={{
                    padding:     "10px 13px",
                    borderRadius: msg.sender === "user"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    background:  msg.sender === "user"
                      ? "linear-gradient(135deg,#2563EB,#4f46e5)"
                      : "#fff",
                    color:       msg.sender === "user" ? "#fff" : "#1e293b",
                    boxShadow:   msg.sender === "user"
                      ? "0 2px 10px rgba(37,99,235,.3)"
                      : "0 1px 4px rgba(0,0,0,.08)",
                    border:      msg.sender === "ai" ? "1px solid #e2e8f0" : "none",
                  }}>
                    {msg.sender === "ai"
                      ? <FormattedMsg text={msg.text} />
                      : <p style={{ margin:0, fontSize:"13px", lineHeight:"1.5" }}>{msg.text}</p>
                    }
                  </div>
                  <p style={{
                    margin:"3px 0 0",
                    fontSize:"10px",
                    color:"#94a3b8",
                    textAlign: msg.sender === "user" ? "right" : "left",
                  }}>{msg.time}</p>
                </div>

                {msg.sender === "user" && (
                  <div style={{
                    width:"28px", height:"28px", borderRadius:"50%",
                    background:"linear-gradient(135deg,#2563EB,#4f46e5)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"13px", flexShrink:0, color:"#fff", fontWeight:700,
                  }}>U</div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display:"flex", gap:"8px", alignItems:"flex-end" }}>
                <div style={{
                  width:"28px", height:"28px", borderRadius:"50%",
                  background:"linear-gradient(135deg,#dbeafe,#ede9fe)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px",
                }}>🏥</div>
                <div style={{
                  padding:"12px 16px", background:"#fff",
                  borderRadius:"18px 18px 18px 4px",
                  border:"1px solid #e2e8f0",
                  boxShadow:"0 1px 4px rgba(0,0,0,.08)",
                  display:"flex", gap:"4px", alignItems:"center",
                }}>
                  {[0,120,240].map(d => (
                    <span key={d} style={{
                      width:"7px", height:"7px",
                      borderRadius:"50%",
                      background:"linear-gradient(135deg,#2563EB,#4f46e5)",
                      display:"inline-block",
                      animation:`aiBounce 1s ${d}ms infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick chips */}
          <div style={{
            padding:"8px 12px", background:"#fff",
            borderTop:"1px solid #f1f5f9",
            display:"flex", gap:"6px", overflowX:"auto", flexShrink:0,
          }}>
            {QUICK.map(s => (
              <button
                key={s}
                className="ai-quick-btn"
                onClick={() => send(`I have a ${s.toLowerCase().replace(/ ?[🤧🌡️😷😔]/g,"").trim()}`)}
                style={{
                  flexShrink:0, fontSize:"11px", fontWeight:600,
                  background:"#eff6ff", color:"#2563EB",
                  border:"1px solid #bfdbfe", padding:"5px 11px",
                  borderRadius:"20px", cursor:"pointer",
                  transition:"background .15s, color .15s",
                  whiteSpace:"nowrap", fontFamily:"inherit",
                }}
              >{s}</button>
            ))}
          </div>

          {/* Input row */}
          <div style={{
            padding:"10px 12px", background:"#fff",
            borderTop:"1px solid #f1f5f9",
            display:"flex", gap:"8px", alignItems:"center", flexShrink:0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && send()}
              placeholder="Describe your symptoms…"
              style={{
                flex:1, padding:"10px 16px",
                background:"#f8fafc", border:"1.5px solid #e2e8f0",
                borderRadius:"24px", fontSize:"13px",
                outline:"none", fontFamily:"inherit", color:"#1e293b",
                transition:"border-color .2s",
              }}
              onFocus={e => e.target.style.borderColor="#2563EB"}
              onBlur={e => e.target.style.borderColor="#e2e8f0"}
            />
            <button
              className="ai-send-btn"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width:"38px", height:"38px", borderRadius:"50%",
                background: !input.trim() || loading ? "#e2e8f0" : "linear-gradient(135deg,#2563EB,#4f46e5)",
                border:"none", cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                color:"#fff", fontSize:"16px",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, transition:"background .2s",
              }}
            >➤</button>
          </div>

          {/* Disclaimer */}
          <div style={{
            padding:"7px 12px", background:"#fefce8",
            borderTop:"1px solid #fef08a",
            textAlign:"center", flexShrink:0,
          }}>
            <p style={{ margin:0, fontSize:"10px", color:"#854d0e" }}>
              ⚠️ AI advice only. Always consult a real doctor for diagnosis.
            </p>
          </div>
        </div>
      )}
    </>
  );
}