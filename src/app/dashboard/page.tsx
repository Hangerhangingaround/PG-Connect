import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardRedirect() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const role = (session.user as any)?.role;

    if (role === "PG_OWNER") {
        redirect("/dashboard/pg-owner");
    } else if (role === "PAYING_GUEST") {
        redirect("/dashboard/paying-guest");
    } else {
        // Fallback for unknown roles or missing roles
        redirect("/");
    }
}
