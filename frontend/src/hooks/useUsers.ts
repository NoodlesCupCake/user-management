import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
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
        queryFn: () => userService.getUsers(search),
    });
}

// ─── Fetch single user by slug ────────────────────────────────
export function useUser(slug: string) {
    return useQuery({
        queryKey: userKeys.detail(slug),
        queryFn: () => userService.getUserBySlug(slug),
        enabled: !!slug,
    });
}

// ─── Create user mutation ─────────────────────────────────────
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: PersonCreate) => userService.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}

// ─── Update user mutation ─────────────────────────────────────
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: PersonUpdate;
        }) => userService.updateUser(id, data),
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
        mutationFn: (id: string) => userService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}

// ─── Bulk create users (for CSV import) ───────────────────────
export function useBulkCreateUsers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (users: PersonCreate[]) => userService.bulkCreateUsers(users),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}
