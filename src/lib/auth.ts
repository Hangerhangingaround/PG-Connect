import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

console.log("[DEBUG] NEXTAUTH_SECRET is:", process.env.NEXTAUTH_SECRET ? "DEFINED" : "UNDEFINED");
console.log("[DEBUG] MONGODB_URI is:", process.env.MONGODB_URI ? "DEFINED" : "UNDEFINED");

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("[AUTH] Authorize attempt for:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log("[AUTH] Missing credentials");
                    return null;
                }

                try {
                    const db = await getDb();
                    console.log("[AUTH] Connected to MongoDB, searching for user in 'users' collection...");
                    const user = await db.collection("users").findOne({ Email: credentials.email });

                    if (!user) {
                        console.log("[AUTH] User not found in MongoDB. Attempting fallback to .NET Backend API...");
                        try {
                            const res = await fetch("http://localhost:5003/api/v1/auth/login", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: credentials.email, password: credentials.password })
                            });

                            if (!res.ok) {
                                console.log("[AUTH] .NET Backend login failed with status:", res.status);
                                return null;
                            }

                            const data = await res.json();
                            console.log("[AUTH] .NET Backend login SUCCESS for role:", data.role);

                            // Normalize roles from .NET to Next.js
                            let role = "PAYING_GUEST";
                            if (data.role === "PropertyOwner" || data.role === "PG_OWNER") role = "PG_OWNER";
                            if (data.role === "Admin" || data.role === "ADMIN") role = "ADMIN";

                            return {
                                id: credentials.email, 
                                name: credentials.email.split("@")[0], 
                                email: credentials.email,
                                role: role
                            };
                        } catch (apiError) {
                            console.error("[AUTH] Failed to reach .NET Backend:", apiError);
                            return null;
                        }
                    }

                    if (!user.PasswordHash) {
                        console.log("[AUTH] User found but missing PasswordHash");
                        return null;
                    }

                    console.log("[AUTH] User found, verifying password...");
                    const isValid = await bcrypt.compare(credentials.password, user.PasswordHash);
                    
                    if (!isValid) {
                        console.log("[AUTH] Invalid password for user:", credentials.email);
                        throw new Error("CredentialsSignin"); // Specific code for invalid password
                    }

                    console.log("[AUTH] Auth successful for:", user.Email, "Role:", user.Role);
                    return {
                        id: user.Id,
                        name: user.Name || user.Email.split("@")[0],
                        email: user.Email,
                        role: user.Role
                    };
                } catch (error) {
                    console.error("[AUTH] Error during authorize:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    logger: {
        error(code, metadata) {
            console.error("[NEXTAUTH_ERROR]", code, metadata);
        },
        warn(code) {
            console.warn("[NEXTAUTH_WARN]", code);
        },
        debug(code, metadata) {
            console.log("[NEXTAUTH_DEBUG]", code, metadata);
        }
    },
};
