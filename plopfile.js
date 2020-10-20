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
        type: "add",
        path:
          "src/components/{{pascalCase name}}/{{pascalCase name}}.module.scss",
        templateFile: "plop-templates/Component/Component.module.scss.hbs",
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
      {
        type: "add",
        path: "server/routes/{{snakeCase name}}.js",
        templateFile: "plop-templates/Route/route.js.hbs",
      },
      {
        type: "add",
        path: "server/routes/index.js",
        templateFile: "plop-templates/Route/injectable-index.js.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "server/routes/index.js",
        pattern: "/* PLOP_INJECT_REQUIRE */",
        template: 'const {{snakeCase name}} = require("./{{snakeCase name}}");',
      },
      {
        type: "append",
        path: "server/routes/index.js",
        pattern: "/* PLOP_INJECT_MOUNT */",
        template: '  app.use("/api/{{kebabCase name}}s", {{snakeCase name}});',
      },
    ],
  });
};
