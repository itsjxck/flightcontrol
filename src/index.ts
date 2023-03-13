import { default as Project } from "./blocks/Project";
import { default as Environment } from "./blocks/Environment";
import { StaticEnvVariable, FromParameterStoreEnvVariable, FromServiceEnvVariable } from "./blocks/EnvVariable";
import { DatabaseService, FargateService, StaticService } from "./blocks/Service";

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
