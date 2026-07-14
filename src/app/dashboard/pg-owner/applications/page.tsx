import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getOwnerApplications, getOwnerPgs } from "@/lib/data";
import { ApplicationsFilterList } from "@/components/dashboard/ApplicationsFilterList";

export default async function ApplicationsPage() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    const [applications, pgs] = await Promise.all([
        getOwnerApplications(userId),
        getOwnerPgs(userId)
    ]);

    return (
        <div>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Guest Applications</h1>
                <p style={{ color: "var(--text-secondary)" }}>Review and manage residency requests across your portfolio.</p>
            </div>

            <ApplicationsFilterList initialApplications={applications} pgs={pgs} />
        </div>
    );
}
