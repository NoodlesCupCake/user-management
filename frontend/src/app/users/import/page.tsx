"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HelloCsv from "hello-csv/react";
import "hello-csv/react/index.css";
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
        <div className="space-y-10">
            {/* Breadcrumb & Header */}
            <div className="space-y-4">
                <nav className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/users" className="hover:text-white transition-colors">
                        Users
                    </Link>
                    <span>/</span>
                    <span className="text-white">Import CSV</span>
                </nav>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        Import Users
                    </h1>
                    <p className="mt-3 text-lg text-gray-400">
                        Easily bulk-create users by uploading a CSV file and mapping your columns.
                    </p>
                </div>
            </div>

            {/* Success Result */}
            {importResult && (
                <div className="rounded-[px] border border-emerald-500/20 bg-emerald-500/10 p-5 shadow-2xl shadow-emerald-500/10 transition-all hover:bg-emerald-500/15">
                    <div className="flex items-start gap-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-3xl">
                            ✅
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-emerald-400">
                                Import Complete!
                            </h3>
                            <p className="text-emerald-300/70">
                                We've successfully processed <strong>{importResult.success}</strong> of{" "}
                                <strong>{importResult.total}</strong> users from your file.
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <button
                            onClick={() => router.push("/users")}
                            className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-emerald-500/20 active:scale-95"
                        >
                            View All Users
                        </button>
                        <button
                            onClick={() => setImportResult(null)}
                            className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
                        >
                            Import More Data
                        </button>
                    </div>
                </div>
            )}

            {/* hello-csv Importer Container */}
            {!importResult && (
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gray-900/40 p-2 shadow-2xl backdrop-blur-xl">
                    <div className="border-b border-white/5 bg-white/5 rounded-2xl p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-2xl shadow-inner">
                                🚀
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Data Mapping Engine</h2>
                                <p className="text-sm text-gray-500">Pick a file to match your source data to our schema.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/20 p-6 mt-4 bg-white rounded-xl">
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
                                            validators: [
                                                { validate: "required" },
                                                { validate: "email" }
                                            ],
                                        },
                                        {
                                            id: "role",
                                            label: "User Role",
                                            type: "string",
                                        },
                                        {
                                            id: "phone",
                                            label: "Phone Number",
                                            type: "string",
                                        },
                                        {
                                            id: "slug",
                                            label: "Unique Slug",
                                            type: "string",
                                        },
                                        {
                                            id: "status",
                                            label: "Account Status",
                                            type: "string",
                                        },
                                    ],
                                },
                            ]}
                            onComplete={handleComplete}
                        />
                    </div>

                    {/* Infinite Progress Bar - decorative */}
                    {bulkCreate.isPending && (
                        <div className="absolute bottom-0 left-0 h-1.5 w-full overflow-hidden bg-violet-950/20">
                            <div className="h-full w-1/3 animate-[loading_1.5s_infinite_linear] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                        </div>
                    )}
                </div>
            )}

            {/* Supplemental Guides */}
            {!importResult && (
                <div className="grid gap-10 lg:grid-cols-2">
                    <div className="group rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-sm transition-all hover:bg-white/[0.08]">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-2xl transition-transform group-hover:scale-110">
                                📋
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Golden Format</h3>
                                <p className="text-sm text-gray-500">Best headers for auto-matching</p>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-2xl bg-black/40 border border-white/5 shadow-2xl">
                            <div className="flex items-center justify-between bg-white/5 px-5 py-3 border-b border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">example_data.csv</span>
                                <div className="flex gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-red-500/50" />
                                    <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                                    <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
                                </div>
                            </div>
                            <pre className="p-6 text-xs font-mono leading-relaxed text-indigo-300/80">
                                {`name,email,role,phone,status
"Anya Taylor","anya@example.com","admin","+1-555...","active"
"Marcus Wright","marcus@example.com","member","+1-555...","active"
"Sana Minato","sana@example.com","viewer","+81-3...","inactive"`}
                            </pre>
                        </div>
                    </div>

                    <div className="group rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-sm transition-all hover:bg-white/[0.08]">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-2xl transition-transform group-hover:scale-110">
                                💡
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Smart Processing</h3>
                                <p className="text-sm text-gray-500">How we handle your data</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {[
                                { title: "Intelligent Slugs", text: "We transform names like 'John Doe' into 'john-doe' if a slug isn't provided." },
                                { title: "Safe Defaults", text: "Roles and statuses are validated. Unknown values default to 'member' and 'active'." },
                                { title: "Auto-Avatars", text: "Missing avatars are instantly generated using the DiceBear platform." }
                            ].map((tip, i) => (
                                <div key={i} className="flex gap-5">
                                    <div className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-emerald-500/20 text-xs font-black text-emerald-400">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-200">{tip.title}</h4>
                                        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{tip.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes loading {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(300%); }
                }
            `}</style>
        </div>
    );
}
