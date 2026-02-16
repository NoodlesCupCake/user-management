import pb from "@/lib/pocketbase";
import { Person, PersonCreate, PersonUpdate } from "@/lib/types";

export const userService = {
    /**
     * Fetch all users from the 'people' collection
     */
    async getUsers(search?: string): Promise<Person[]> {
        const filter = search
            ? `name ~ "${search}" || email ~ "${search}" || role ~ "${search}"`
            : "";

        return await pb.collection('people').getFullList({
            sort: '-name',
            filter,
        });
    },

    /**
     * Fetch a single user by their slug
     */
    async getUserBySlug(slug: string): Promise<Person> {
        return await pb
            .collection("people")
            .getFirstListItem<Person>(`slug = "${slug}"`);
    },

    /**
     * Create a new user record
     */
    async createUser(data: PersonCreate): Promise<Person> {
        return await pb.collection("people").create<Person>(data);
    },

    /**
     * Update an existing user record
     */
    async updateUser(id: string, data: PersonUpdate): Promise<Person> {
        return await pb.collection("people").update<Person>(id, data);
    },

    /**
     * Delete a user record
     */
    async deleteUser(id: string): Promise<boolean> {
        return await pb.collection("people").delete(id);
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
