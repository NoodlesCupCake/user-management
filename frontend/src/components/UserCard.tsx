"use client";

import Link from "next/link";
import { Person, ROLE_COLORS, STATUS_COLORS } from "@/lib/types";

interface UserCardProps {
    user: Person;
}

export default function UserCard({ user }: UserCardProps) {
    return (
        <Link href={`/users/${user.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-gray-900/80 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1">
                {/* Gradient accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="h-14 w-14 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 p-0.5">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.name}
                                    className="h-full w-full rounded-[10px] bg-gray-800 object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gray-800 text-xl font-bold text-violet-400">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        {/* Status dot */}
                        <div
                            className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-gray-900 ${user.status === "active" ? "bg-emerald-500" : "bg-gray-500"
                                }`}
                        />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate text-base font-semibold text-white group-hover:text-violet-300 transition-colors">
                                {user.name}
                            </h3>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-gray-400">
                            {user.email}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role]
                                    }`}
                            >
                                {user.role}
                            </span>
                            <span
                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[user.status]
                                    }`}
                            >
                                {user.status}
                            </span>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-gray-600 transition-all group-hover:text-violet-400 group-hover:translate-x-0.5">
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
