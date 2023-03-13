import BuildContext from "../../context";
import EnvVariable, { buildEnvVariables, BuiltEnvVariable } from "../EnvVariable";
import { DatabaseServiceType } from "./Database";
import { FargateServiceType } from "./Fargate";
import { StaticServiceType } from "./Static";

type BuildTypes = "nixpacks" | "nodejs" | "docker" | "fromService" | "fromRepository";

export type ServiceType = FargateServiceType | StaticServiceType | DatabaseServiceType;
export type ServiceBuildType<U extends BuildTypes = BuildTypes> = U;

export type ServiceConfig = {
  type: ServiceType;
  id: string;
  name?: string;
  buildType?: ServiceBuildType;
  watchPaths?: string[];
  envVariables?: EnvVariable[];
};

abstract class Service {
  private _envVariables?: ServiceConfig["envVariables"];

  constructor(private config: ServiceConfig) {
    this._envVariables = config.envVariables;
  }

  get type(): ServiceConfig["type"] {
    return this.config.type;
  }

  get id(): ServiceConfig["id"] {
    return this.config.id;
  }

  get name(): ServiceConfig["name"] {
    return this.config.name;
  }

  get watchPaths(): ServiceConfig["watchPaths"] {
    return this.config.watchPaths;
  }

  get envVariables(): ServiceConfig["envVariables"] {
    return this._envVariables;
  }

  addEnvVariables(...envVariables: EnvVariable[]): Service {
    if (this._envVariables === undefined) this._envVariables = [];
    this._envVariables.push(...envVariables);
    return this;
  }
}

export const buildBaseService = (
  context: BuildContext,
  service: Service,
): Omit<ServiceConfig, "envVariables"> & {
  envVariables?: BuiltEnvVariable[];
} => {
  return {
    type: service.type,
    id: service.id,
    name: service.name,
    watchPaths: service.watchPaths,
    envVariables: buildEnvVariables(context, service.envVariables),
  };
};

export default Service;
