"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import UserCard from "@/components/UserCard";
import Link from "next/link";

export default function UsersPage() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search input
    const handleSearch = (value: string) => {
        setSearch(value);
        // Simple debounce with timeout
        const timer = setTimeout(() => {
            setDebouncedSearch(value);
        }, 300);
        return () => clearTimeout(timer);
    };

    // TanStack Query: fetch users with optional search filter
    const { data: users, isLoading, isError, error } = useUsers(debouncedSearch);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        People
                    </h1>
                    <p className="mt-1 text-gray-400">
                        Manage your team members and their roles
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/users/import"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
                    >
                        📄 Import CSV
                    </Link>
                    <Link
                        href="/users/new"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:brightness-110"
                    >
                        ➕ Add User
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <svg
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by name, email, or role..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition-all focus:border-violet-500/50 focus:bg-white/10 focus:ring-2 focus:ring-violet-500/20"
                />
                {users && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        {users.length} user{users.length !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                        <p className="text-sm text-gray-400">Loading users...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
                    <p className="text-red-400">
                        Failed to load users:{" "}
                        {error instanceof Error ? error.message : "Unknown error"}
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                        Please check if the PocketBase API is accessible.
                        If you are using Docker, ensure the gateway is running.
                    </p>
                </div>
            )}

            {/* User Grid */}
            {users && users.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {users && users.length === 0 && (
                <div className="flex flex-col items-center gap-4 py-20">
                    <div className="text-6xl">👥</div>
                    <h3 className="text-xl font-semibold text-white">No users found</h3>
                    <p className="text-gray-400">
                        {search
                            ? "Try a different search term"
                            : "Get started by adding your first user"}
                    </p>
                    {!search && (
                        <Link
                            href="/users/new"
                            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl"
                        >
                            ➕ Add User
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
