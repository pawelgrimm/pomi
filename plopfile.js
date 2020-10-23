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
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "plop-templates/Component/Component.tsx.hbs",
      },
      {
        // Test
        type: "add",
        path:
          "src/components/{{pascalCase name}}/test/{{pascalCase name}}.test.tsx",
        templateFile: "plop-templates/Component/Component.test.tsx.hbs",
      },
      {
        // Index
        type: "add",
        path: "src/components/{{pascalCase name}}/index.ts",
        templateFile: "plop-templates/Component/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/components/index.ts",
        templateFile: "plop-templates/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/components/index.ts",
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `import {{pascalCase name}} from "./{{pascalCase name}}";`,
      },
      {
        type: "append",
        path: "src/components/index.ts",
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `\t{{pascalCase name}},`,
      },
    ],
  });
  plop.setGenerator("route", {
    description: "Create a reusable route",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "what model does this route concern?",
      },
    ],
    actions: [
      // ROUTE
      {
        type: "add",
        path: "server/routes/{{snakeCase name}}.ts",
        templateFile: "plop-templates/Route/route.ts.hbs",
      },
      {
        type: "add",
        path: "server/routes/index.ts",
        templateFile: "plop-templates/Route/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      // QUERY
      {
        type: "add",
        path: "server/db/queries/{{snakeCase name}}s.ts",
        templateFile: "plop-templates/Database/Query/queries.ts.hbs",
      },
      {
        type: "add",
        path: "server/db/queries/index.ts",
        templateFile: "plop-templates/Database/Query/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "server/db/queries/index.ts",
        pattern: "/* PLOP_INJECT_IMPORT */",
        template:
          'import { bind{{pascalCase name}}Queries } from "./{{snakeCase name}}s";',
      },
      {
        type: "append",
        path: "server/db/queries/index.ts",
        pattern: "/* PLOP_INJECT_EXPORT */",
        template: "  bind{{pascalCase name}}Queries,",
      },
      {
        type: "add",
        path: "server/db/index.ts",
        templateFile: "plop-templates/Database/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "server/db/index.ts",
        pattern: "/* PLOP_INJECT_IMPORT */",
        template: "  bind{{pascalCase name}}Queries,",
      },

      {
        type: "append",
        path: "server/db/index.ts",
        pattern: "/* PLOP_INJECT_BIND */",
        template:
          "export const {{snakeCase name}}s = bind{{pascalCase name}}Queries(query);",
      },
      {
        type: "add",
        path: "server/routes/index.ts",
        templateFile: "plop-templates/Route/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "server/routes/index.ts",
        pattern: "/* PLOP_INJECT_IMPORT */",
        template: 'import {{snakeCase name}} from "./{{snakeCase name}}";',
      },
      {
        type: "append",
        path: "server/routes/index.ts",
        pattern: "/* PLOP_INJECT_MOUNT */",
        template: '  app.use("/api/{{kebabCase name}}s", {{snakeCase name}});',
      },
    ],
  });
};
