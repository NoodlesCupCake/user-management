/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const superusers = app.findCollectionByNameOrId("_superusers");

    const record = new Record(superusers);
    record.set("email", "admin@example.com");
    record.set("password", "admin12345678");
    app.save(record);
}, (app) => {
    try {
        const record = app.findAuthRecordByEmail("_superusers", "admin@example.com");
        app.delete(record);
    } catch {
        // already deleted
    }
});
