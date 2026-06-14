import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ClientDashboardShell } from "@/components/dashboard/ClientDashboardShell";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const role = (session.user as any).role;
    const allowedRoles = ["PG_OWNER", "PAYING_GUEST", "ADMIN"];

    if (!allowedRoles.includes(role)) {
        redirect("/login");
    }

    return (
        <ClientDashboardShell>
            {children}
        </ClientDashboardShell>
    );
}
