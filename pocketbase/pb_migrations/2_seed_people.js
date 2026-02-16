/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const collection = app.findCollectionByNameOrId("people");

    const people = [
        {
            name: "Alice Johnson",
            email: "alice@example.com",
            slug: "alice-johnson",
            role: "admin",
            phone: "+1-555-0101",
            avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice",
            status: "active",
        },
        {
            name: "Bob Williams",
            email: "bob@example.com",
            slug: "bob-williams",
            role: "manager",
            phone: "+1-555-0102",
            avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob",
            status: "active",
        },
        {
            name: "Carol Davis",
            email: "carol@example.com",
            slug: "carol-davis",
            role: "member",
            phone: "+1-555-0103",
            avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Carol",
            status: "active",
        },
        {
            name: "David Brown",
            email: "david@example.com",
            slug: "david-brown",
            role: "member",
            phone: "+1-555-0104",
            avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=David",
            status: "inactive",
        },
        {
            name: "Eva Martinez",
            email: "eva@example.com",
            slug: "eva-martinez",
            role: "viewer",
            phone: "+1-555-0105",
            avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Eva",
            status: "active",
        },
    ];

    for (const person of people) {
        const record = new Record(collection);
        record.set("name", person.name);
        record.set("email", person.email);
        record.set("slug", person.slug);
        record.set("role", person.role);
        record.set("phone", person.phone);
        record.set("avatar_url", person.avatar_url);
        record.set("status", person.status);
        app.save(record);
    }
}, (app) => {
    const collection = app.findCollectionByNameOrId("people");
    const records = app.findRecordsByFilter(collection, "1=1");
    for (const record of records) {
        app.delete(record);
    }
});
