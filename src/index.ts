import { default as Project } from "./blocks/Project";
import { default as Environment } from "./blocks/Environment";
import { StaticEnvVariable, FromParameterStoreEnvVariable, FromServiceEnvVariable } from "./blocks/EnvVariable";
import { DatabaseService, FargateService, StaticService } from "./blocks/Service";

export type { ProjectConfig } from "./blocks/Project/Project";
export type { ProjectDefaultsConfig } from "./blocks/Project/Defaults";
export type { EnvironmentConfig } from "./blocks/Environment/Environment";
export type { EnvVariableConfig } from "./blocks/EnvVariable/EnvVariable";
export type { StaticEnvVariableConfig } from "./blocks/EnvVariable/Static";
export type { FromParameterStoreEnvVariableConfig } from "./blocks/EnvVariable/FromParameterStore";
export type { FromServiceEnvVariableConfig } from "./blocks/EnvVariable/FromService";
export type { ServiceConfig } from "./blocks/Service/Service";
export type { FargateServiceConfig } from "./blocks/Service/Fargate";
export type { StaticServiceConfig } from "./blocks/Service/Static";
export type { DatabaseServiceConfig } from "./blocks/Service/Database";

const EnvVariable = {
  Static: StaticEnvVariable,
  FromParameterStore: FromParameterStoreEnvVariable,
  FromService: FromServiceEnvVariable,
};

const Service = {
  Fargate: FargateService,
  Static: StaticService,
  Database: DatabaseService,
};

export { Project, Environment, EnvVariable, Service };

export default {
  Project,
  Environment,
  EnvVariable,
  Service,
};
