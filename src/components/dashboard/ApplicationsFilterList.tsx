"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";
import { PgApplication, PgListing } from "@/models";

interface ApplicationsFilterListProps {
    initialApplications: PgApplication[];
    pgs: PgListing[];
}

export const ApplicationsFilterList: React.FC<ApplicationsFilterListProps> = ({ 
    initialApplications, 
    pgs 
}) => {
    const [applications, setApplications] = useState<PgApplication[]>(initialApplications);
    const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

    // Dynamic counts
    const pendingCount = applications.filter(a => a.Status === "PENDING").length;
    const approvedCount = applications.filter(a => a.Status === "APPROVED").length;
    const rejectedCount = applications.filter(a => a.Status === "REJECTED").length;

    // Filter applications by active tab status
    const filteredApplications = applications.filter(a => a.Status === activeTab);

    // Callback if an application is updated (status changes in the child component)
    // We update our local state so the counts and lists stay perfectly in sync!
    const handleStatusChange = (appId: string, newStatus: string) => {
        setApplications(prev => 
            prev.map(app => app.Id === appId ? { ...app, Status: newStatus as any } : app)
        );
    };

    return (
        <div>
            {/* Application Stages */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
                <Button 
                    variant={activeTab === "PENDING" ? "primary" : "outline"} 
                    size="sm" 
                    style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "12px" }}
                    onClick={() => setActiveTab("PENDING")}
                >
                    <Clock size={16} /> Pending ({pendingCount})
                </Button>
                <Button 
                    variant={activeTab === "APPROVED" ? "primary" : "outline"} 
                    size="sm" 
                    style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "12px" }}
                    onClick={() => setActiveTab("APPROVED")}
                >
                    <CheckCircle2 size={16} /> Approved ({approvedCount})
                </Button>
                <Button 
                    variant={activeTab === "REJECTED" ? "primary" : "outline"} 
                    size="sm" 
                    style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "12px" }}
                    onClick={() => setActiveTab("REJECTED")}
                >
                    <XCircle size={16} /> Rejected ({rejectedCount})
                </Button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {filteredApplications.length === 0 ? (
                    <Card padding="60px" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📬</div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>No applications found</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                            There are currently no {activeTab.toLowerCase()} applications in this stage.
                        </p>
                    </Card>
                ) : (
                    filteredApplications.map(app => {
                        const pg = pgs.find(p => p.Id === app.PgId);
                        // Wrap in a key-matching helper that propagates status changes
                        return (
                            <div key={app.Id} style={{ position: "relative" }}>
                                <ApplicationCard 
                                    application={app} 
                                    pg={pg} 
                                    onStatusChange={handleStatusChange}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
