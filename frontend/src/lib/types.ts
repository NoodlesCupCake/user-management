export interface Person {
    id: string;
    name: string;
    email: string;
    slug: string;
    role: "admin" | "manager" | "member" | "viewer";
    phone: string;
    avatar_url: string;
    status: "active" | "inactive";
    created: string;
    updated: string;
}

export type PersonCreate = Omit<Person, "id" | "created" | "updated">;
export type PersonUpdate = Partial<PersonCreate>;

export const ROLE_OPTIONS = ["admin", "manager", "member", "viewer"] as const;
export const STATUS_OPTIONS = ["active", "inactive"] as const;

export const ROLE_COLORS: Record<string, string> = {
    admin: "bg-red-500/20 text-red-400 border-red-500/30",
    manager: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    member: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    viewer: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export const STATUS_COLORS: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400",
    inactive: "bg-gray-500/20 text-gray-400",
};
