"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Clock, User } from "lucide-react";
import { Message } from "@/models";

interface ChatWidgetProps {
    pgId: string;
    ownerId: string;
    pgTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
    pgId,
    ownerId,
    pgTitle,
    isOpen,
    onClose
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Fetch messages
    const fetchMessages = async (showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const res = await fetch(`/api/chat?receiverId=${ownerId}&pgId=${pgId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // Scroll to bottom helper
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Initial load
    useEffect(() => {
        if (isOpen) {
            fetchMessages(true);
        }
    }, [isOpen, pgId, ownerId]);

    // Scroll when messages change
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Polling for updates every 4 seconds
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            fetchMessages(false);
        }, 4000);

        return () => clearInterval(interval);
    }, [isOpen, pgId, ownerId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || sending) return;

        setSending(true);
        const tempContent = content;
        setContent("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: ownerId,
                    pgId: pgId,
                    content: tempContent
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, data.message]);
            } else {
                alert("Failed to send message. Please try again.");
                setContent(tempContent); // Restore typed content on failure
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setContent(tempContent);
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "380px",
            height: "500px",
            maxHeight: "80vh",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            zIndex: 3500,
            display: "flex",
            flexDirection: "column",
            border: "1px solid var(--border-light)",
            overflow: "hidden",
            animation: "fadeInUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)"
        }}>
            {/* Header */}
            <div style={{
                background: "var(--primary)",
                color: "white",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ 
                        width: "36px", 
                        height: "36px", 
                        borderRadius: "50%", 
                        background: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <User size={18} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Chat with Owner</div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.85, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "220px" }}>
                            {pgTitle}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px"
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages Stream */}
            <div style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                background: "var(--bg-secondary)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
            }}>
                {loading ? (
                    <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                        Loading conversation...
                    </div>
                ) : messages.length === 0 ? (
                    <div style={{ display: "flex", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "var(--text-secondary)", textAlign: "center", padding: "0 20px" }}>
                        <MessageSquare size={36} style={{ color: "var(--border)", marginBottom: "4px" }} />
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)" }}>Start the conversation!</div>
                        <div style={{ fontSize: "0.8rem" }}>Ask the owner about room availability, amenities, rules, or gate timings.</div>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.SenderId !== ownerId;
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
                                    maxWidth: "75%",
                                    padding: "10px 14px",
                                    borderRadius: isMe ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                                    background: isMe ? "var(--primary)" : "white",
                                    color: isMe ? "white" : "var(--text)",
                                    fontSize: "0.875rem",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                                    lineHeight: 1.4,
                                    wordBreak: "break-word"
                                }}>
                                    {msg.Content}
                                    <div style={{
                                        fontSize: "0.65rem",
                                        textAlign: "right",
                                        marginTop: "4px",
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

            {/* Input Form */}
            <form 
                onSubmit={handleSend}
                style={{
                    padding: "12px 16px",
                    borderTop: "1px solid var(--border-light)",
                    display: "flex",
                    gap: "8px",
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
                        padding: "10px 14px",
                        border: "1px solid var(--border)",
                        borderRadius: "20px",
                        fontSize: "0.875rem",
                        outline: "none"
                    }}
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={!content.trim() || sending}
                    style={{
                        width: "36px",
                        height: "36px",
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
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};
