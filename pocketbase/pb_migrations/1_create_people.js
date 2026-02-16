/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = new Collection({
    type: "base",
    name: "people",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      {
        type: "text",
        name: "name",
        required: true,
        max: 200,
      },
      {
        type: "email",
        name: "email",
        required: true,
      },
      {
        type: "text",
        name: "slug",
        required: true,
        max: 200,
      },
      {
        type: "select",
        name: "role",
        required: true,
        maxSelect: 1,
        values: ["admin", "manager", "member", "viewer"],
      },
      {
        type: "text",
        name: "phone",
        max: 50,
      },
      {
        type: "url",
        name: "avatar_url",
      },
      {
        type: "select",
        name: "status",
        required: true,
        maxSelect: 1,
        values: ["active", "inactive"],
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_people_slug ON people (slug)",
      "CREATE UNIQUE INDEX idx_people_email ON people (email)",
    ],
  });

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("people");
  app.delete(collection);
});
