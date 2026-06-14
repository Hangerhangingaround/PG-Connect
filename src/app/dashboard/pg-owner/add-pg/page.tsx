import React from "react";
import { AddPgForm } from "@/components/dashboard/AddPgForm";

export default function AddPgPage() {
    return (
        <div>
            <div style={{ marginBottom: "40px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px" }}>
                    Add New Property
                </h1>
                <p style={{ color: "var(--text-secondary)" }}>
                    Enter the details of your new PG to list it on PGXplore.
                </p>
            </div>

            <AddPgForm />
        </div>
    );
}
