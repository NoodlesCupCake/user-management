"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateUser } from "@/hooks/useUsers";
import UserForm from "@/components/UserForm";
import type { PersonCreate } from "@/lib/types";

export default function NewUserPage() {
    const router = useRouter();

    // TanStack Mutation: create new user
    const createUser = useCreateUser();

    const handleSubmit = async (data: PersonCreate) => {
        try {
            const newUser = await createUser.mutateAsync(data);
            router.push(`/users/${newUser.slug}`);
        } catch (err) {
            console.error("Create failed:", err);
            alert("Failed to create user. Check console for details.");
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
                <span className="text-white">New User</span>
            </nav>

            {/* Form Card */}
            <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-sm">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Create New User</h1>
                    <p className="mt-1 text-gray-400">
                        Add a new member to your team
                    </p>
                </div>

                <UserForm
                    onSubmit={handleSubmit}
                    isLoading={createUser.isPending}
                    submitLabel="Create User"
                />
            </div>
        </div>
    );
}
