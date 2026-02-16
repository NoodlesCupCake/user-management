"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HelloCsv from "hello-csv/react";
import { useBulkCreateUsers } from "@/hooks/useUsers";
import type { PersonCreate } from "@/lib/types";

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s]+/g, "-")
        .replace(/-+/g, "-");
}

export default function ImportPage() {
    const router = useRouter();
    const bulkCreate = useBulkCreateUsers();
    const [importResult, setImportResult] = useState<{
        success: number;
        total: number;
    } | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleComplete = async (state: any) => {
        // hello-csv provides state.sheetData as SheetState[]
        // Each SheetState has { sheetId, rows } where rows is SheetRow[]
        const sheetData = state.sheetData || [];
        const allRows: Record<string, string>[] = sheetData.flatMap(
            (sheet: { rows: Record<string, string>[] }) => sheet.rows || []
        );

        const users: PersonCreate[] = allRows.map((row) => ({
            name: String(row.name || ""),
            email: String(row.email || ""),
            slug: String(row.slug || generateSlug(String(row.name || ""))),
            role: (String(row.role || "member") as PersonCreate["role"]),
            phone: String(row.phone || ""),
            avatar_url:
                String(row.avatar_url || "") ||
                `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(String(row.name || "user"))}`,
            status: (String(row.status || "active") as PersonCreate["status"]),
        }));

        try {
            const results = await bulkCreate.mutateAsync(users);
            setImportResult({ success: results.length, total: users.length });
        } catch (err) {
            console.error("Bulk import failed:", err);
        }
    };

    return (
        <div className="space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/users" className="hover:text-white transition-colors">
                    Users
                </Link>
                <span>/</span>
                <span className="text-white">Import CSV</span>
            </nav>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Import Users from CSV
                </h1>
                <p className="mt-2 text-gray-400">
                    Upload a CSV file to bulk-create users. Map your columns to the
                    required fields.
                </p>
            </div>

            {/* Success Result */}
            {importResult && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">✅</div>
                        <div>
                            <h3 className="text-lg font-semibold text-emerald-400">
                                Import Complete!
                            </h3>
                            <p className="text-emerald-300/80">
                                Successfully imported {importResult.success} of{" "}
                                {importResult.total} users.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => router.push("/users")}
                            className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-500"
                        >
                            View Users
                        </button>
                        <button
                            onClick={() => setImportResult(null)}
                            className="rounded-xl border border-white/10 px-5 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/5"
                        >
                            Import More
                        </button>
                    </div>
                </div>
            )}

            {/* hello-csv Importer */}
            {!importResult && (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-sm shadow-2xl">
                    <HelloCsv
                        sheets={[
                            {
                                id: "users",
                                label: "Users",
                                columns: [
                                    {
                                        id: "name",
                                        label: "Full Name",
                                        type: "string",
                                        validators: [{ validate: "required" }],
                                    },
                                    {
                                        id: "email",
                                        label: "Email Address",
                                        type: "string",
                                        validators: [{ validate: "required" }, { validate: "email" }],
                                    },
                                    {
                                        id: "role",
                                        label: "Role",
                                        type: "string",
                                    },
                                    {
                                        id: "phone",
                                        label: "Phone",
                                        type: "string",
                                    },
                                    {
                                        id: "slug",
                                        label: "Slug",
                                        type: "string",
                                    },
                                    {
                                        id: "status",
                                        label: "Status",
                                        type: "string",
                                    },
                                ],
                            },
                        ]}
                        onComplete={handleComplete}
                    />

                    {/* Loading state during import */}
                    {bulkCreate.isPending && (
                        <div className="flex items-center justify-center border-t border-white/5 bg-violet-500/5 p-6 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                                <span className="text-sm font-medium text-violet-300">
                                    Processing users... please wait
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* CSV Format Guide - Collapsible or simpler */}
            {!importResult && (
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                            <span>📋</span> Expected CSV Format
                        </h3>
                        <p className="mt-2 text-xs text-gray-400">
                            Your CSV must include <strong>name</strong> and <strong>email</strong>.
                            Other fields like role, phone, and status are optional.
                        </p>
                        <div className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-4">
                            <pre className="text-[10px] leading-relaxed text-gray-400">
                                {`name,email,role,phone,status
John Doe,john@example.com,member,+1-555-0100,active
Jane Smith,jane@example.com,admin,+1-555-0200,active`}
                            </pre>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                            <span>💡</span> Pro Tips
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs text-gray-400">
                            <li className="flex gap-2">
                                <span className="text-violet-400">•</span>
                                <span>Slugs are auto-generated from names if missing.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-violet-400">•</span>
                                <span>Valid roles: admin, manager, member, viewer.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-violet-400">•</span>
                                <span>Default status is "active".</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
