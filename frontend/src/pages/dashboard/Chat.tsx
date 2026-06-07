"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  MessageCircleIcon,
  SendIcon,
  ChevronLeftIcon,
  SearchIcon,
  Loader2Icon,
  UserIcon,
  CheckCheckIcon,
  ArrowLeftIcon,
} from "lucide-react";

const API = "https://macaw-english-course.onrender.com/api/messages";

/* ── Mock contacts when API is unavailable ── */
const mockContacts = [
  { id: "teacher1", name: "Prof. Sarah", role: "Teacher", online: true, avatar: "👩‍🏫" },
  { id: "teacher2", name: "Prof. James", role: "Teacher", online: true, avatar: "👨‍🏫" },
  { id: "support", name: "Suporte Macaw", role: "Support", online: true, avatar: "🎓" },
];

const mockMessages = [
  { id: "m1", senderId: "teacher1", senderName: "Prof. Sarah", receiverId: "student", text: "Hello! How are your studies going?", sentAt: new Date(Date.now() - 3600000).toISOString(), isRead: true },
  { id: "m2", senderId: "student", senderName: "You", receiverId: "teacher1", text: "Hi Sarah! I'm doing great, just finished the A2 module!", sentAt: new Date(Date.now() - 3000000).toISOString(), isRead: true },
  { id: "m3", senderId: "teacher1", senderName: "Prof. Sarah", receiverId: "student", text: "That's wonderful! 🎉 Ready to start B1?", sentAt: new Date(Date.now() - 2400000).toISOString(), isRead: false },
];

export default function Chat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState(mockContacts);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat, scrollToBottom]);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openChat = (contact) => {
    setActiveChat(contact);
    setShowMobileList(false);
    fetchConversation(contact.id);
  };

  const fetchConversation = async (contactId) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API}/conversation/${user.id}/${contactId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setMessages(data);
        return;
      }
    } catch {}
    // Keep existing mock messages
    setMessages(mockMessages);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !activeChat || !user) return;
    setSending(true);

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: user.id || "student",
      senderName: user.name || "You",
      receiverId: activeChat.id,
      receiverName: activeChat.name,
      text: inputText.trim(),
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    // Optimistically add to UI
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    try {
      await fetch(`${API}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: newMsg.senderId,
          senderName: newMsg.senderName,
          receiverId: newMsg.receiverId,
          receiverName: newMsg.receiverName,
          text: newMsg.text,
        }),
      });
    } catch {
      // Message already added to UI, no need to handle error
    }
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const chatMessages = activeChat
    ? messages.filter(
        (m) =>
          (m.senderId === (user?.id || "student") && m.receiverId === activeChat.id) ||
          (m.senderId === activeChat.id && m.receiverId === (user?.id || "student"))
      )
    : [];

  return (
    <div className="flex h-[calc(100vh-10rem)] max-h-[700px]">
      {/* ── Contacts List ── */}
      <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/20 rounded-l-xl ${
        showMobileList ? "block" : "hidden md:block"
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircleIcon className="size-5 text-primary" strokeWidth={1.5} />
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Mensagens</h2>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Buscar contato..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto h-[calc(100%-110px)]">
          {filteredContacts.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Nenhum contato encontrado</p>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => openChat(contact)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition text-left ${
                  activeChat?.id === contact.id
                    ? "bg-primary/5 dark:bg-primary/10 border-l-2 border-primary"
                    : "border-l-2 border-transparent"
                }`}
              >
                <div className="relative shrink-0">
                  <span className="text-xl">{contact.avatar}</span>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{contact.name}</p>
                  <p className="text-xs text-slate-400">{contact.role}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-800/10 rounded-r-xl ${
        !showMobileList ? "block" : "hidden md:flex"
      }`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/20 rounded-tr-xl">
              <button
                onClick={() => { setShowMobileList(true); setActiveChat(null); }}
                className="md:hidden p-1 text-slate-400 hover:text-primary transition"
              >
                <ArrowLeftIcon size={20} strokeWidth={1.5} />
              </button>
              <span className="text-xl">{activeChat.avatar}</span>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">{activeChat.name}</p>
                <p className="text-xs text-emerald-500">{activeChat.online ? "Online" : "Offline"}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircleIcon className="size-12 text-slate-300 dark:text-slate-600 mb-3" strokeWidth={1} />
                  <p className="text-xs text-slate-400">Nenhuma mensagem ainda. Inicie uma conversa!</p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMe = msg.senderId === (user?.id || "student") || msg.senderName === "You";
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-bl-md"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                          <span className="text-[10px] opacity-60">
                            {new Date(msg.sentAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {isMe && (
                            <CheckCheckIcon size={12} className={msg.isRead ? "text-emerald-300" : "opacity-40"} strokeWidth={2} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/20 rounded-br-xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || sending}
                  className="p-2.5 rounded-xl bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white transition"
                >
                  {sending ? <Loader2Icon className="size-5 animate-spin" strokeWidth={1.5} /> : <SendIcon className="size-5" strokeWidth={1.5} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircleIcon className="size-8 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Suas Mensagens</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Selecione um contato ao lado para começar a conversar com professores e suporte.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
