import { Person, PersonCreate, PersonUpdate } from "@/lib/types";

// Helper to get the absolute API URL
const getApiUrl = (path: string) => {
    let baseUrl = "http://127.0.0.1:8090";

    if (typeof window !== "undefined") {
        const port = window.location.port;
        if (port === "" || port === "80" || port === "433") {
            baseUrl = window.location.origin;
        } else if (port === "3000" || port === "3001") {
            baseUrl = "http://127.0.0.1:8090";
        } else {
            baseUrl = window.location.origin;
        }
    } else {
        // Server-side
        baseUrl = "http://pocketbase:8090";
    }

    return `${baseUrl}/api/${path}`;
};

export const userService = {
    /**
     * Fetch all users from the 'people' collection
     */
    async getUsers(search?: string): Promise<Person[]> {
        const filter = search
            ? encodeURIComponent(`name ~ "${search}" || email ~ "${search}" || role ~ "${search}"`)
            : "";

        const url = getApiUrl(`collections/people/records?sort=-created${filter ? `&filter=${filter}` : ""}`);

        const response = await fetch(url, {
            cache: 'no-store'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch users");
        }

        const data = await response.json();
        return data.items;
    },

    /**
     * Fetch a single user by their slug
     */
    async getUserBySlug(slug: string): Promise<Person> {
        const filter = encodeURIComponent(`slug = "${slug}"`);
        const url = getApiUrl(`collections/people/records?filter=${filter}`);

        const response = await fetch(url, {
            cache: 'no-store'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch user");
        }

        const data = await response.json();
        if (data.items.length === 0) {
            throw new Error("User not found");
        }

        return data.items[0];
    },

    /**
     * Create a new user record
     */
    async createUser(data: PersonCreate): Promise<Person> {
        const url = getApiUrl("collections/people/records");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create user");
        }

        return await response.json();
    },

    /**
     * Update an existing user record
     */
    async updateUser(id: string, data: PersonUpdate): Promise<Person> {
        const url = getApiUrl(`collections/people/records/${id}`);

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update user");
        }

        return await response.json();
    },

    /**
     * Delete a user record
     */
    async deleteUser(id: string): Promise<boolean> {
        const url = getApiUrl(`collections/people/records/${id}`);

        const response = await fetch(url, {
            method: "DELETE",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete user");
        }

        return true;
    },

    /**
     * Bulk create users
     */
    async bulkCreateUsers(users: PersonCreate[]): Promise<Person[]> {
        const results: Person[] = [];
        for (const user of users) {
            try {
                const record = await this.createUser(user);
                results.push(record);
            } catch (error) {
                console.error(`Failed to create user ${user.email}:`, error);
            }
        }
        return results;
    }
};
