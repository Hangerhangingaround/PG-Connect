"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/portfolio/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Navbar } from "@/components/portfolio/Navbar";

function LoginForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered") === "true";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    React.useEffect(() => {
        if (status === "authenticated" && session?.user) {
            if ((session.user as any).role === "PG_OWNER") {
                router.push("/dashboard/pg-owner");
            } else if ((session.user as any).role === "PAYING_GUEST") {
                router.push("/dashboard/paying-guest");
            } else {
                router.push("/");
            }
        }
    }, [status, session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                console.log("[LOGIN] SignIn failed:", res.error);
                if (res.error === "CredentialsSignin") {
                    setError("Invalid email or password. Please try again.");
                } else {
                    setError(res.error || "Authentication failed");
                }
            } else {
                console.log("[LOGIN] SignIn successful, fetching session...");
                const sessionRes = await fetch("/api/auth/session");
                const session = await sessionRes.json();
                
                if (session?.user?.role === "PG_OWNER") {
                    router.push("/dashboard/pg-owner");
                } else if (session?.user?.role === "PAYING_GUEST") {
                    router.push("/dashboard/paying-guest");
                } else {
                    router.push("/");
                }
            }
        } catch (err) {
            console.error("[LOGIN] Exception during handleSubmit:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card padding="40px" shadow="lg" style={{ borderRadius: "24px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {registered && !error && (
                    <div style={{ padding: "12px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "12px", fontSize: "0.9rem", textAlign: "center", border: "1px solid rgba(16, 185, 129, 0.2)", marginBottom: "8px" }}>
                        🎉 Account created successfully! Please sign in.
                    </div>
                )}
                {error && (
                    <div style={{ padding: "12px", background: "#fef2f2", color: "#dc2626", borderRadius: "12px", fontSize: "0.9rem", textAlign: "center", border: "1px solid #fee2e2" }}>
                        {error}
                    </div>
                )}
                
                <Input 
                    label="Email Address" 
                    type="email" 
                    placeholder="name@university.edu" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                
                <Input 
                    label="Password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />

                <Button type="submit" size="lg" fullWidth shadow="lg" disabled={loading} style={{ marginTop: "12px" }}>
                    {loading ? "Signing in..." : "Continue to Dashboard"}
                </Button>

                <div style={{ textAlign: "center", marginTop: "12px" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                        Don't have an account? <Link href="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>Register here</Link>
                    </p>
                </div>
            </form>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <main style={{ minHeight: "100vh", background: "white" }}>
            <Navbar />
            
            <Container size="sm" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "16px", letterSpacing: "-1.5px" }}>
                        Sign In to PGXplore
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
                        Access your dashboard and manage your stays
                    </p>
                </div>

                <Suspense fallback={<div>Loading form...</div>}>
                    <LoginForm />
                </Suspense>

                <p style={{ textAlign: "center", marginTop: "40px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </Container>
        </main>
    );
}
