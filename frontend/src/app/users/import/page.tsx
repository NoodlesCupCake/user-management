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
                <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-white">
                            CSV File Upload
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Your CSV should contain columns for name, email, and optionally
                            role, phone, slug, and status.
                        </p>
                    </div>

                    <HelloCsv
                        sheets={[
                            {
                                id: "users",
                                label: "Users",
                                columns: [
                                    {
                                        id: "name",
                                        label: "Full Name",
                                        type: "string" as const,
                                        validators: [
                                            {
                                                validate: "required" as const,
                                            },
                                        ],
                                    },
                                    {
                                        id: "email",
                                        label: "Email Address",
                                        type: "string" as const,
                                        validators: [
                                            {
                                                validate: "required" as const,
                                            },
                                        ],
                                    },
                                    {
                                        id: "role",
                                        label: "Role",
                                        type: "string" as const,
                                        validators: [],
                                    },
                                    {
                                        id: "phone",
                                        label: "Phone",
                                        type: "string" as const,
                                        validators: [],
                                    },
                                    {
                                        id: "slug",
                                        label: "Slug (auto-generated if empty)",
                                        type: "string" as const,
                                        validators: [],
                                    },
                                    {
                                        id: "status",
                                        label: "Status (active/inactive)",
                                        type: "string" as const,
                                        validators: [],
                                    },
                                ],
                            },
                        ]}
                        onComplete={handleComplete}
                    />

                    {/* Loading state during import */}
                    {bulkCreate.isPending && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl bg-violet-500/10 p-4">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                            <span className="text-sm text-violet-300">
                                Importing users... please wait
                            </span>
                        </div>
                    )}

                    {/* CSV Format Guide */}
                    <div className="mt-8 rounded-xl border border-white/5 bg-white/5 p-6">
                        <h3 className="text-sm font-semibold text-gray-300">
                            📋 Expected CSV Format
                        </h3>
                        <div className="mt-3 overflow-x-auto">
                            <pre className="text-xs text-gray-400">
                                {`name,email,role,phone,slug,status
John Doe,john@example.com,member,+1-555-0100,john-doe,active
Jane Smith,jane@example.com,admin,+1-555-0200,jane-smith,active`}
                            </pre>
                        </div>
                        <p className="mt-3 text-xs text-gray-500">
                            Only <strong>name</strong> and <strong>email</strong> are
                            required. Other fields will use default values if omitted.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
