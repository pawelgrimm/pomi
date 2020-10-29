module.exports = function (plop) {
  plop.setGenerator("component", {
    description: "Create a reusable component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your component name?",
      },
    ],
    actions: [
      {
        // Component
        type: "add",
        path:
          "src/client/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "plop-templates/Component/Component.tsx.hbs",
      },
      {
        // Test
        type: "add",
        path:
          "src/client/components/{{pascalCase name}}/test/{{pascalCase name}}.test.tsx",
        templateFile: "plop-templates/Component/Component.test.tsx.hbs",
      },
      {
        // Index
        type: "add",
        path: "src/client/components/{{pascalCase name}}/index.ts",
        templateFile: "plop-templates/Component/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/client/components/index.ts",
        templateFile: "plop-templates/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/client/components/index.ts",
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `import {{pascalCase name}} from "./{{pascalCase name}}";`,
      },
      {
        type: "append",
        path: "src/client/components/index.ts",
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `\t{{pascalCase name}},`,
      },
    ],
  });
  plop.setGenerator("model", {
    description: "Create a reusable model",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "what is the model name (singular)?",
      },
    ],
    actions: [
      // QUERY
      {
        type: "add",
        path: "src/server/db/queries/{{camelCase name}}s.ts",
        templateFile: "plop-templates/Database/Query/queries.ts.hbs",
      },
      {
        type: "add",
        path: "src/server/db/queries/index.ts",
        templateFile: "plop-templates/Database/Query/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/server/db/queries/index.ts",
        pattern: "/* PLOP_INJECT_IMPORT */",
        template:
          'import { bind{{pascalCase name}}Queries } from "./{{camelCase name}}s";',
      },
      {
        type: "append",
        path: "src/server/db/queries/index.ts",
        pattern: "/* PLOP_INJECT_EXPORT */",
        template: "  bind{{pascalCase name}}Queries,",
      },
      // DB
      {
        type: "add",
        path: "src/server/db/index.ts",
        templateFile: "plop-templates/Database/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/server/db/index.ts",
        pattern: "/* PLOP_INJECT_IMPORT */",
        template: "  bind{{pascalCase name}}Queries,",
      },
      {
        type: "append",
        path: "src/server/db/index.ts",
        pattern: "/* PLOP_INJECT_BIND */",
        template:
          "export const {{pascalCase name}}s = bind{{pascalCase name}}Queries(query);",
      },
      // MODEL
      {
        type: "add",
        path: "src/shared/models/{{camelCase name}}.ts",
        templateFile: "plop-templates/Model/model.ts.hbs",
      },
      {
        type: "add",
        path: "src/shared/models/index.ts",
        templateFile: "plop-templates/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/shared/models/index.ts",
        pattern: "/* PLOP_INJECT_IMPORT */",
        template:
          'import { {{pascalCase name}}Model } from "./{{camelCase name}}";',
      },
      {
        type: "append",
        path: "src/shared/models/index.ts",
        pattern: "/* PLOP_INJECT_EXPORT */",
        template: "  {{pascalCase name}}Model,",
      },
      // VALIDATORS
      {
        type: "add",
        path: "src/shared/validators/{{camelCase name}}.ts",
        templateFile: "plop-templates/Validator/validator.ts.hbs",
      },
      {
        type: "add",
        path: "src/shared/validators/test/{{camelCase name}}.test.ts",
        templateFile: "plop-templates/Validator/validator.test.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "src/shared/validators/index.ts",
        templateFile: "plop-templates/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/shared/validators/index.ts",
        pattern: "/* PLOP_INJECT_IMPORT */",
        template:
          'import { validate{{pascalCase name}} } from "./{{camelCase name}}";',
      },
      {
        type: "append",
        path: "src/shared/validators/index.ts",
        pattern: "/* PLOP_INJECT_EXPORT */",
        template: "  validate{{pascalCase name}},",
      },
      // ROUTE
      {
        type: "add",
        path: "src/server/routes/{{camelCase name}}.ts",
        templateFile: "plop-templates/Route/route.ts.hbs",
      },
      {
        type: "add",
        path: "src/server/routes/tests/{{camelCase name}}.test.ts",
        templateFile: "plop-templates/Route/route.test.ts.hbs",
      },
      {
        type: "add",
        path: "src/server/routes/index.ts",
        templateFile: "plop-templates/Route/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/server/routes/index.ts",
        pattern: "/* PLOP_INJECT_IMPORT */",
        template: 'import {{camelCase name}} from "./{{camelCase name}}";',
      },
      {
        type: "append",
        path: "src/server/routes/index.ts",
        pattern: "/* PLOP_INJECT_MOUNT */",
        template: '  app.use("/api/{{kebabCase name}}s", {{camelCase name}});',
      },
    ],
  });
};
