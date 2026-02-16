"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useUpdateUser } from "@/hooks/useUsers";
import UserForm from "@/components/UserForm";
import type { PersonCreate } from "@/lib/types";

export default function EditUserPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const router = useRouter();

    // TanStack Query: fetch user to pre-fill form
    const { data: user, isLoading, isError } = useUser(slug);

    // TanStack Mutation: update user
    const updateUser = useUpdateUser();

    const handleSubmit = async (data: PersonCreate) => {
        if (!user) return;

        try {
            await updateUser.mutateAsync({ id: user.id, data });
            router.push(`/users/${data.slug}`);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update user. Check console for details.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                    <p className="text-sm text-gray-400">Loading user data...</p>
                </div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="flex flex-col items-center gap-4 py-20">
                <div className="text-6xl">😞</div>
                <h2 className="text-xl font-semibold text-white">User not found</h2>
                <Link
                    href="/users"
                    className="rounded-xl bg-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/20"
                >
                    ← Back to Users
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/users" className="hover:text-white transition-colors">
                    Users
                </Link>
                <span>/</span>
                <Link
                    href={`/users/${user.slug}`}
                    className="hover:text-white transition-colors"
                >
                    {user.name}
                </Link>
                <span>/</span>
                <span className="text-white">Edit</span>
            </nav>

            {/* Form Card */}
            <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-sm">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Edit User</h1>
                    <p className="mt-1 text-gray-400">
                        Update details for {user.name}
                    </p>
                </div>

                <UserForm
                    initialData={user}
                    onSubmit={handleSubmit}
                    isLoading={updateUser.isPending}
                    submitLabel="Update User"
                />
            </div>
        </div>
    );
}
