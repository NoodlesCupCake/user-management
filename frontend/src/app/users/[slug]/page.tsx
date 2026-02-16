"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useDeleteUser } from "@/hooks/useUsers";
import { ROLE_COLORS, STATUS_COLORS } from "@/lib/types";

export default function UserDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const router = useRouter();

    // TanStack Query: fetch single user by slug
    const { data: user, isLoading, isError, error } = useUser(slug);
    const deleteUser = useDeleteUser();

    const handleDelete = async () => {
        if (!user) return;
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

        try {
            await deleteUser.mutateAsync(user.id);
            router.push("/users");
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                    <p className="text-sm text-gray-400">Loading user...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center gap-4 py-20">
                <div className="text-6xl">😞</div>
                <h2 className="text-xl font-semibold text-white">User not found</h2>
                <p className="text-gray-400">
                    {error instanceof Error ? error.message : `No user with slug "${slug}"`}
                </p>
                <Link
                    href="/users"
                    className="mt-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/20"
                >
                    ← Back to Users
                </Link>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/users" className="hover:text-white transition-colors">
                    Users
                </Link>
                <span>/</span>
                <span className="text-white">{user.name}</span>
            </nav>

            {/* Profile Card */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-sm">
                {/* Header gradient */}
                <div className="h-32 bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-purple-600/30" />

                <div className="px-8 pb-8">
                    {/* Avatar overlapping header */}
                    <div className="-mt-16 flex items-end gap-6">
                        <div className="h-28 w-28 overflow-hidden rounded-2xl border-4 border-gray-950 bg-gray-800 shadow-xl">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-violet-400">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="mb-2 flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                                <span
                                    className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role]}`}
                                >
                                    {user.role}
                                </span>
                                <span
                                    className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[user.status]}`}
                                >
                                    ● {user.status}
                                </span>
                            </div>
                            <p className="mt-1 text-gray-400">/{user.slug}</p>
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                Email
                            </p>
                            <p className="mt-1 text-sm text-white">{user.email}</p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                Phone
                            </p>
                            <p className="mt-1 text-sm text-white">
                                {user.phone || "—"}
                            </p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                Created
                            </p>
                            <p className="mt-1 text-sm text-white">
                                {new Date(user.created).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                Last Updated
                            </p>
                            <p className="mt-1 text-sm text-white">
                                {new Date(user.updated).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex items-center gap-4">
                        <Link
                            href={`/users/${user.slug}/edit`}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:brightness-110"
                        >
                            ✏️ Edit User
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleteUser.isPending}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
                        >
                            🗑️ Delete
                        </button>
                        <Link
                            href="/users"
                            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
