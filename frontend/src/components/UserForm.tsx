"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Person, PersonCreate, ROLE_OPTIONS, STATUS_OPTIONS } from "@/lib/types";

interface UserFormProps {
    initialData?: Person;
    onSubmit: (data: PersonCreate) => void;
    isLoading: boolean;
    submitLabel?: string;
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s]+/g, "-")
        .replace(/-+/g, "-");
}

export default function UserForm({
    initialData,
    onSubmit,
    isLoading,
    submitLabel = "Save",
}: UserFormProps) {
    const router = useRouter();

    const [formData, setFormData] = useState<PersonCreate>({
        name: initialData?.name || "",
        email: initialData?.email || "",
        slug: initialData?.slug || "",
        role: initialData?.role || "member",
        phone: initialData?.phone || "",
        avatar_url: initialData?.avatar_url || "",
        status: initialData?.status || "active",
    });

    // Auto-generate slug from name (only if creating new)
    useEffect(() => {
        if (!initialData && formData.name) {
            setFormData((prev) => ({
                ...prev,
                slug: generateSlug(prev.name),
            }));
        }
    }, [formData.name, initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const inputClasses =
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-violet-500/50 focus:bg-white/10 focus:ring-2 focus:ring-violet-500/20";

    const labelClasses = "mb-2 block text-sm font-medium text-gray-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email row */}
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label htmlFor="name" className={labelClasses}>
                        Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. John Doe"
                        className={inputClasses}
                    />
                </div>
                <div>
                    <label htmlFor="email" className={labelClasses}>
                        Email <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className={inputClasses}
                    />
                </div>
            </div>

            {/* Slug */}
            <div>
                <label htmlFor="slug" className={labelClasses}>
                    Slug <span className="text-red-400">*</span>
                    <span className="ml-2 text-xs text-gray-500">
                        (auto-generated from name)
                    </span>
                </label>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="john-doe"
                    className={inputClasses}
                />
            </div>

            {/* Role & Status row */}
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label htmlFor="role" className={labelClasses}>
                        Role <span className="text-red-400">*</span>
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role} className="bg-gray-900">
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className={labelClasses}>
                        Status <span className="text-red-400">*</span>
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status} className="bg-gray-900">
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Phone & Avatar URL */}
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label htmlFor="phone" className={labelClasses}>
                        Phone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1-555-0100"
                        className={inputClasses}
                    />
                </div>
                <div>
                    <label htmlFor="avatar_url" className={labelClasses}>
                        Avatar URL
                    </label>
                    <input
                        type="url"
                        id="avatar_url"
                        name="avatar_url"
                        value={formData.avatar_url}
                        onChange={handleChange}
                        placeholder="https://example.com/avatar.png"
                        className={inputClasses}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <svg
                                className="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        submitLabel
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-xl border border-white/10 px-6 py-3 font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
