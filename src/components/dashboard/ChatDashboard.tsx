"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
    Search, 
    MessageSquare, 
    Send, 
    User, 
    Mail, 
    Phone, 
    Building2,
    Clock
} from "lucide-react";

interface Conversation {
    OtherUserId: string;
    PgId: string;
    LastMessage: {
        Content: string;
        CreatedAt: string;
        SenderId: string;
    };
    UnreadCount: number;
    OtherUser: {
        Name: string;
        Email: string;
        Role: string;
        Phone?: string;
    };
    PgTitle: string;
}

interface ChatDashboardProps {
    role: "PG_OWNER" | "PAYING_GUEST";
}

export const ChatDashboard: React.FC<ChatDashboardProps> = ({ role }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConv, setActiveConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [search, setSearch] = useState("");
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [sending, setSending] = useState(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Fetch conversation list
    const fetchConversations = async (showLoading = false) => {
        if (showLoading) setLoadingConvs(true);
        try {
            const res = await fetch("/api/chat");
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
                
                // If there's an active conversation, update it in place to refresh unread count / last message
                if (activeConv) {
                    const updated = data.find((c: Conversation) => 
                        c.OtherUserId === activeConv.OtherUserId && c.PgId === activeConv.PgId
                    );
                    if (updated) setActiveConv(updated);
                }
            }
        } catch (err) {
            console.error("Error fetching conversations:", err);
        } finally {
            if (showLoading) setLoadingConvs(false);
        }
    };

    // Fetch messages for active thread
    const fetchMessages = async (showLoading = false) => {
        if (!activeConv) return;
        if (showLoading) setLoadingMsgs(true);
        try {
            const res = await fetch(`/api/chat?receiverId=${activeConv.OtherUserId}&pgId=${activeConv.PgId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            if (showLoading) setLoadingMsgs(false);
        }
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Initial load
    useEffect(() => {
        fetchConversations(true);
    }, []);

    // Fetch messages when active conversation changes
    useEffect(() => {
        if (activeConv) {
            fetchMessages(true);
            // Clear unread counts locally
            setConversations(prev => 
                prev.map(c => 
                    c.OtherUserId === activeConv.OtherUserId && c.PgId === activeConv.PgId 
                        ? { ...c, UnreadCount: 0 } 
                        : c
                )
            );
        } else {
            setMessages([]);
        }
    }, [activeConv?.OtherUserId, activeConv?.PgId]);

    // Scroll when messages change
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Polling interval (every 4 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchConversations(false);
            if (activeConv) {
                fetchMessages(false);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [activeConv?.OtherUserId, activeConv?.PgId]);

    // Send a message
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !activeConv || sending) return;

        setSending(true);
        const tempContent = content;
        setContent("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: activeConv.OtherUserId,
                    pgId: activeConv.PgId,
                    content: tempContent
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, data.message]);
                // Refresh list to update last message
                fetchConversations(false);
            } else {
                alert("Failed to send message.");
                setContent(tempContent);
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setContent(tempContent);
        } finally {
            setSending(false);
        }
    };

    // Filter conversations by search input
    const filteredConvs = conversations.filter(c => 
        c.OtherUser.Name.toLowerCase().includes(search.toLowerCase()) ||
        c.PgTitle.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card padding="0" style={{ height: "calc(100vh - 180px)", display: "flex", overflow: "hidden", borderRadius: "16px" }}>
            {/* Left Column: Conversations List */}
            <div style={{
                width: "320px",
                borderRight: "1px solid var(--border-light)",
                display: "flex",
                flexDirection: "column",
                background: "white",
                flexShrink: 0
            }}>
                {/* Search Header */}
                <div style={{ padding: "20px", borderBottom: "1px solid var(--border-light)" }}>
                    <div style={{ position: "relative" }}>
                        <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                        <input 
                            type="text" 
                            placeholder="Search chats..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 12px 10px 38px",
                                border: "1px solid var(--border)",
                                borderRadius: "10px",
                                fontSize: "0.875rem",
                                outline: "none"
                            }}
                        />
                    </div>
                </div>

                {/* List Pane */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                    {loadingConvs ? (
                        <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                            Loading inbox...
                        </div>
                    ) : filteredConvs.length === 0 ? (
                        <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                            No conversations found.
                        </div>
                    ) : (
                        filteredConvs.map(conv => {
                            const isSelected = activeConv?.OtherUserId === conv.OtherUserId && activeConv?.PgId === conv.PgId;
                            const isLastMsgMe = conv.LastMessage.SenderId !== conv.OtherUserId;
                            return (
                                <div 
                                    key={`${conv.OtherUserId}_${conv.PgId}`}
                                    onClick={() => setActiveConv(conv)}
                                    style={{
                                        padding: "16px 20px",
                                        borderBottom: "1px solid var(--border-light)",
                                        background: isSelected ? "var(--primary-light)" : "white",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px"
                                    }}
                                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--bg-secondary)"; }}
                                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "white"; }}
                                >
                                    {/* Avatar */}
                                    <div style={{ 
                                        width: "44px", 
                                        height: "44px", 
                                        borderRadius: "50%", 
                                        background: "var(--bg-secondary)", 
                                        color: "var(--primary)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        flexShrink: 0
                                    }}>
                                        {conv.OtherUser.Name.slice(0, 1).toUpperCase()}
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                                            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: isSelected ? "var(--primary)" : "var(--text)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                                {conv.OtherUser.Name}
                                            </span>
                                            <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                                                {new Date(conv.LastMessage.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                            🏠 {conv.PgTitle}
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: isSelected ? "var(--text)" : "var(--text-secondary)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                            {isLastMsgMe ? "You: " : ""}{conv.LastMessage.Content}
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    {conv.UnreadCount > 0 && (
                                        <div style={{ 
                                            background: "var(--primary)", 
                                            color: "white", 
                                            borderRadius: "50%", 
                                            width: "18px", 
                                            height: "18px", 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center", 
                                            fontSize: "0.65rem", 
                                            fontWeight: 800,
                                            flexShrink: 0
                                        }}>
                                            {conv.UnreadCount}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Column: Chat Window */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-secondary)" }}>
                {activeConv ? (
                    <>
                        {/* Selected Thread Header */}
                        <div style={{
                            padding: "16px 24px",
                            background: "white",
                            borderBottom: "1px solid var(--border-light)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>{activeConv.OtherUser.Name}</h4>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", gap: "8px", marginTop: "4px" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Building2 size={12} /> {activeConv.PgTitle}</span>
                                    <span>•</span>
                                    <span>{activeConv.OtherUser.Role === "PG_OWNER" ? "Owner" : "Student"}</span>
                                </div>
                            </div>

                            {/* Contact Details drawer/popover */}
                            <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={14} /> {activeConv.OtherUser.Email}</span>
                                {activeConv.OtherUser.Phone && (
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Phone size={14} /> {activeConv.OtherUser.Phone}</span>
                                )}
                            </div>
                        </div>

                        {/* Thread Message Stream */}
                        <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                            {loadingMsgs ? (
                                <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                                    Retrieving messages...
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isMe = msg.SenderId !== activeConv.OtherUserId;
                                    return (
                                        <div 
                                            key={msg.Id}
                                            style={{
                                                display: "flex",
                                                justifyContent: isMe ? "flex-end" : "flex-start",
                                                width: "100%"
                                            }}
                                        >
                                            <div style={{
                                                maxWidth: "60%",
                                                padding: "12px 16px",
                                                borderRadius: isMe ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                                                background: isMe ? "var(--primary)" : "white",
                                                color: isMe ? "white" : "var(--text)",
                                                fontSize: "0.875rem",
                                                lineHeight: 1.45,
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                                                wordBreak: "break-word"
                                            }}>
                                                {msg.Content}
                                                <div style={{
                                                    fontSize: "0.65rem",
                                                    textAlign: "right",
                                                    marginTop: "6px",
                                                    opacity: 0.7,
                                                    color: isMe ? "white" : "var(--text-secondary)"
                                                }}>
                                                    {new Date(msg.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Thread Input Form */}
                        <form 
                            onSubmit={handleSend}
                            style={{
                                padding: "16px 24px",
                                borderTop: "1px solid var(--border-light)",
                                display: "flex",
                                gap: "12px",
                                alignItems: "center",
                                background: "white"
                            }}
                        >
                            <input 
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    padding: "12px 16px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "24px",
                                    fontSize: "0.9rem",
                                    outline: "none"
                                }}
                                disabled={loadingMsgs}
                            />
                            <button
                                type="submit"
                                disabled={!content.trim() || sending}
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "50%",
                                    background: content.trim() ? "var(--primary)" : "var(--bg-secondary)",
                                    color: content.trim() ? "white" : "var(--text-secondary)",
                                    border: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: content.trim() ? "pointer" : "default",
                                    transition: "all 0.2s"
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    /* Empty State */
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", color: "var(--text-secondary)", padding: "40px" }}>
                        <div style={{ 
                            width: "72px", 
                            height: "72px", 
                            borderRadius: "50%", 
                            background: "white", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            boxShadow: "var(--shadow-sm)",
                            color: "var(--primary)",
                            marginBottom: "8px"
                        }}>
                            <MessageSquare size={32} />
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>No Chat Selected</h3>
                        <p style={{ margin: 0, fontSize: "0.875rem", textAlign: "center", maxWidth: "300px" }}>
                            Select a thread from the list on the left to start corresponding in real-time.
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
};
