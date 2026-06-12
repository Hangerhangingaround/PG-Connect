"use client"; 

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/portfolio/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Navbar } from "@/components/portfolio/Navbar";
import { UserRole } from "@/models/User";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function RegisterPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [role, setRole] = useState<UserRole>("PAYING_GUEST");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [permanentAddress, setPermanentAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("OTHER");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    React.useEffect(() => {
        if (status === "authenticated" && session?.user) {
            if ((session.user as any).role === "PG_OWNER") {
                router.push("/owner/dashboard");
            } else {
                router.push("/");
            }
        }
    }, [status, session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setSubmitting(true);
        
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                    permanentAddress,
                    phone,
                    gender
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");

            // Auto sign-in
            const signInRes = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (signInRes?.error) {
                console.error("[AUTO-LOGIN] Failed:", signInRes.error);
                setError("Account created, but automatic sign-in failed. Please login manually.");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    if (role === "PG_OWNER") {
                        router.push("/owner/dashboard");
                    } else {
                        router.push("/");
                    }
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <main style={{ minHeight: "100vh", background: "white" }}>
                <Navbar />
                <Container size="sm" style={{ paddingTop: "120px", textAlign: "center" }}>
                    <div style={{ fontSize: "5rem", marginBottom: "24px" }}>🎉</div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "16px" }}>Welcome to PGXplore!</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", marginBottom: "40px" }}>
                        Your account has been created and saved in our records. <br />
                        <strong>Redirecting you to your dashboard...</strong>
                    </p>
                </Container>
            </main>
        );
    }

    return (
        <main style={{ minHeight: "100vh", background: "white" }}>
            <Navbar />
            
            <Container size="sm" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "12px", letterSpacing: "-1.5px" }}>
                        Create Account
                    </h1>
                    <p style={{ color: "var(--text-secondary)" }}>Join the PGXplore community today</p>
                </div>

                <div style={{ 
                    background: "white", 
                    padding: "40px", 
                    borderRadius: "24px", 
                    border: "1px solid var(--border-light)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
                }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 600, display: "block", marginBottom: "12px" }}>Continue as</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <Button 
                                    type="button" 
                                    variant={role === "PAYING_GUEST" ? "primary" : "outline"} 
                                    onClick={() => setRole("PAYING_GUEST")}
                                    fullWidth
                                >
                                    Paying Guest
                                </Button>
                                <Button 
                                    type="button" 
                                    variant={role === "PG_OWNER" ? "primary" : "outline"} 
                                    onClick={() => setRole("PG_OWNER")}
                                    fullWidth
                                >
                                    Property Owner
                                </Button>
                            </div>
                        </div>

                        <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                        <Input label="Email Address" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Input label="Phone Number" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                        <div>
                            <label style={{ fontSize: "0.875rem", fontWeight: 600, display: "block", marginBottom: "8px" }}>Gender</label>
                            <select 
                                value={gender} 
                                onChange={(e) => setGender(e.target.value)}
                                style={{ width: "100%", padding: "12px", border: "1px solid var(--border-light)", borderRadius: "12px", outline: "none", fontSize: "0.95rem" }}
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        
                        <TextArea 
                            label="Permanent Address" 
                            placeholder="Your home address for verification" 
                            value={permanentAddress} 
                            onChange={(e) => setPermanentAddress(e.target.value)} 
                            required 
                        />
                        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <Input label="Confirm Password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                        {error && (
                            <p style={{ color: "var(--error)", fontSize: "0.875rem", fontWeight: 500 }}>{error}</p>
                        )}

                        <Button type="submit" size="lg" shadow="lg" disabled={submitting} style={{ marginTop: "12px" }}>
                            {submitting ? "Creating account..." : "Register Now"}
                        </Button>
                    </form>
                </div>

                <p style={{ textAlign: "center", marginTop: "32px", color: "var(--text-secondary)" }}>
                    Already have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Login here</Link>
                </p>
            </Container>
        </main>
    );
}
