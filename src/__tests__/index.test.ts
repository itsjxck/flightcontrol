import { EnvironmentConfig } from "../blocks/Environment/Environment";
import { Environment, EnvVariable, Project, Service } from "../index";

describe("create a project", () => {
  test("should create project json", () => {
    // Create a project with default region
    const project = new Project({ defaults: { region: "eu-west-2" } });

    // Create 3 environments
    const [dev, staging, prod] = (
      [
        ["dev", "Development", { branch: "main" }],
        ["staging", "Staging", { branch: "main" }],
        ["prod", "Production", { branch: "main", trigger: "manual" }],
      ] as [string, string, EnvironmentConfig["source"]][]
    ).map(([id, name, source]) => new Environment({ id, name, source }));

    // Add environments to project
    project.addEnvironments(dev, staging, prod);

    // Create env vars
    const externalApiKey = new EnvVariable.Static({ name: "EXTERNAL_API_KEY", value: "1234567890" });
    const sessionSecret = new EnvVariable.FromParameterStore({
      name: "SESSION_SECRET",
      value: ({ environment }) => `/session/secret/${environment?.id}`,
    });

    // Create database service
    const database = new Service.Database({
      id: "db",
      name: "Database",
      engine: "postgres",
      engineVersion: "14",
      instanceSize: ({ environment }) => (environment?.id === prod.id ? "db.t4g.medium" : "db.t3.micro"),
      storage: 20,
    });

    // Create database env var
    const databaseUrl = database.createEnvVariable({
      name: "DATABASE_URL",
      value: "dbConnectionString",
    });

    // Create API service
    const api = new Service.Fargate({
      id: "redwood-api",
      name: "Redwood API",
      buildType: "nodejs",
      domain: ({ environment }) =>
        environment?.id === prod.id ? "api.example.com" : `api.${environment?.id}.example.com`,
      cpu: ({ environment }) => (environment?.id === prod.id ? 1 : 0.25),
      memory: ({ environment }) => (environment?.id === prod.id ? 4 : 0.5),
      minInstances: ({ environment }) => (environment?.id === prod.id ? 2 : 1),
      maxInstances: ({ environment }) => (environment?.id === prod.id ? 20 : 1),
      installCommand: "yarn set version self && NODE_ENV=development yarn install",
      buildCommand: "yarn workspace cms build:server && yarn rw deploy flightcontrol api && yarn prisma:seed",
      startCommand: "PAYLOAD_CONFIG_PATH=cms/dist/payload.config.js yarn rw deploy flightcontrol api --serve",
      postBuildCommand: "echo 0",
      port: 8911,
      healthCheckPath: "/graphql/health",
      envVariables: [databaseUrl, externalApiKey, sessionSecret],
    });

    // Create API env var
    const apiUrl = new EnvVariable.FromService({
      name: "API_URL",
      service: api,
      value: "origin",
    });

    // Create web service
    const web = new Service.Static({
      id: "redwood-web",
      name: "Redwood Web",
      domain: ({ environment }) =>
        environment?.id === prod.id ? "www.example.com" : `www.${environment?.id}.example.com`,
      singlePageApp: true,
      installCommand: "yarn set version self && NODE_ENV=development yarn install",
      buildCommand: "yarn rw deploy flightcontrol web",
      outputDirectory: "web/dist",
      envVariables: [apiUrl],
    });

    // Create web env var
    const webUrl = new EnvVariable.FromService({
      name: "WEB_URL",
      service: web,
      value: "origin",
    });

    // Add web env var to API
    api.addEnvVariables(webUrl);

    // Add services to all environments
    project.addServicesToAllEnvironments(database, api, web);

    const build = project.build();

    console.log(JSON.stringify(build, null, 2));

    expect(true).toBe(true);
  });
});
