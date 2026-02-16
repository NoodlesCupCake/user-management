"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import type { Person, PersonCreate, PersonUpdate } from "@/lib/types";

// ─── Query Keys ────────────────────────────────────────────────
export const userKeys = {
    all: ["users"] as const,
    list: (search?: string) => [...userKeys.all, "list", search] as const,
    detail: (slug: string) => [...userKeys.all, "detail", slug] as const,
};

// ─── Fetch all users (with optional search) ───────────────────
export function useUsers(search?: string) {
    return useQuery({
        queryKey: userKeys.list(search),
        queryFn: async (): Promise<Person[]> => {
            const filter = search
                ? `name ~ "${search}" || email ~ "${search}" || role ~ "${search}"`
                : "";

            const records = await pb.collection("people").getFullList<Person>({
                sort: "-created",
                filter,
            });

            return records;
        },
    });
}

// ─── Fetch single user by slug ────────────────────────────────
export function useUser(slug: string) {
    return useQuery({
        queryKey: userKeys.detail(slug),
        queryFn: async (): Promise<Person> => {
            const record = await pb
                .collection("people")
                .getFirstListItem<Person>(`slug = "${slug}"`);

            return record;
        },
        enabled: !!slug,
    });
}

// ─── Create user mutation ─────────────────────────────────────
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PersonCreate): Promise<Person> => {
            return await pb.collection("people").create<Person>(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}

// ─── Update user mutation ─────────────────────────────────────
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: PersonUpdate;
        }): Promise<Person> => {
            return await pb.collection("people").update<Person>(id, data);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            // Also invalidate the specific user detail if slug is known
            if (variables.data.slug) {
                queryClient.invalidateQueries({
                    queryKey: userKeys.detail(variables.data.slug),
                });
            }
        },
    });
}

// ─── Delete user mutation ─────────────────────────────────────
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<boolean> => {
            return await pb.collection("people").delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}

// ─── Bulk create users (for CSV import) ───────────────────────
export function useBulkCreateUsers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (users: PersonCreate[]): Promise<Person[]> => {
            const results: Person[] = [];
            for (const user of users) {
                try {
                    const record = await pb.collection("people").create<Person>(user);
                    results.push(record);
                } catch (error) {
                    console.error(`Failed to create user ${user.email}:`, error);
                }
            }
            return results;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}
