import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { Container } from "@/components/portfolio/Container";
import { AddPgForm } from "@/components/dashboard/AddPgForm";

export default async function OwnerAddPgPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/owner/add-pg");
    }

    const role = (session.user as any)?.role;

    if (role !== "PG_OWNER") {
        redirect("/");
    }

    return (
        <main style={{ background: "var(--bg-secondary)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            
            <div style={{ flex: 1, padding: "60px 0" }}>
                <Container size="xl">
                    <div style={{ 
                        textAlign: "center", 
                        marginBottom: "48px", 
                        maxWidth: "600px", 
                        margin: "0 auto 48px auto" 
                    }}>
                        <span style={{ 
                            fontSize: "0.8rem", 
                            fontWeight: 800, 
                            background: "var(--primary-light)", 
                            color: "var(--primary)", 
                            padding: "6px 16px", 
                            borderRadius: "20px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            display: "inline-block",
                            marginBottom: "16px"
                        }}>
                            Host Portal
                        </span>
                        
                        <h1 style={{ 
                            fontSize: "2.5rem", 
                            fontWeight: 800, 
                            color: "var(--text)", 
                            letterSpacing: "-1px",
                            marginBottom: "12px",
                            lineHeight: 1.15
                        }}>
                            List Your Property on <span style={{ color: "var(--primary)" }}>PGXplore</span>
                        </h1>
                        
                        <p style={{ 
                            color: "var(--text-secondary)", 
                            fontSize: "1.1rem",
                            lineHeight: 1.6
                        }}>
                            Reach thousands of university students looking for reliable, premium accommodations near their campuses.
                        </p>
                    </div>

                    <AddPgForm />
                </Container>
            </div>

            <Footer />
        </main>
    );
}
