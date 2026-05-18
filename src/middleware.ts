import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const pathname = req.nextUrl.pathname;
        const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

        if (isAuthPage) {
            if (isAuth) {
                const role = (token as any).role;
                if (role === "PG_OWNER") {
                    return NextResponse.redirect(new URL("/dashboard/pg-owner", req.url));
                } else if (role === "PAYING_GUEST") {
                    return NextResponse.redirect(new URL("/dashboard/paying-guest", req.url));
                }
                return NextResponse.redirect(new URL("/", req.url));
            }
            return NextResponse.next();
        }

        // Role-based protection for the unified dashboard
        if (pathname.startsWith("/dashboard/pg-owner") && (token as any).role !== "PG_OWNER") {
            return NextResponse.redirect(new URL("/dashboard/paying-guest", req.url));
        }

        if (pathname.startsWith("/dashboard/paying-guest") && (token as any).role !== "PAYING_GUEST") {
            return NextResponse.redirect(new URL("/dashboard/pg-owner", req.url));
        }

        // Protect /owner routes to only allow PG_OWNER
        if (pathname.startsWith("/owner") && (token as any).role !== "PG_OWNER") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
                if (isAuthPage) return true;
                return !!token;
            },
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register", "/owner/:path*"],
};
