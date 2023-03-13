import Service, { buildBaseService, ServiceConfig } from "./Service";
import BuildContext, { ExtractValueType, ValueOrFunctionWithBuildContext } from "../../context";
import EnvVariable from "../EnvVariable";

export type DatabaseServiceType = "rds";

export type DatabaseServiceConfig = Omit<ServiceConfig, "type"> & {
  applyChangesImmediately?: ValueOrFunctionWithBuildContext<boolean>;
  autoUpgradeMinorVersions?: ValueOrFunctionWithBuildContext<boolean>;
  instanceSize: ValueOrFunctionWithBuildContext<string>;
  storage: ValueOrFunctionWithBuildContext<number>;
  maxStorage?: ValueOrFunctionWithBuildContext<number>;
  private?: ValueOrFunctionWithBuildContext<boolean>;
  deletionProtection?: ValueOrFunctionWithBuildContext<boolean>;
  port?: ValueOrFunctionWithBuildContext<number>;
} & (
    | {
        engine: "postgres";
        engineVersion: "9" | "10" | "11" | "12" | "13" | "14";
      }
    | {
        engine: "mysql";
        engineVersion: "5.6" | "5.7" | "8";
      }
    | {
        engine: "mariadb";
        engineVersion: "10.2" | "10.3" | "10.4" | "10.5" | "10.6";
      }
  );

class DatabaseService extends Service {
  constructor(private databaseConfig: DatabaseServiceConfig) {
    super({ ...databaseConfig, type: "rds" });
  }

  get engine(): DatabaseServiceConfig["engine"] {
    return this.databaseConfig.engine;
  }

  get engineVersion(): DatabaseServiceConfig["engineVersion"] {
    return this.databaseConfig.engineVersion;
  }

  get applyChangesImmediately(): DatabaseServiceConfig["applyChangesImmediately"] {
    return this.databaseConfig.applyChangesImmediately;
  }

  get autoUpgradeMinorVersions(): DatabaseServiceConfig["autoUpgradeMinorVersions"] {
    return this.databaseConfig.autoUpgradeMinorVersions;
  }

  get instanceSize(): DatabaseServiceConfig["instanceSize"] {
    return this.databaseConfig.instanceSize;
  }

  get storage(): DatabaseServiceConfig["storage"] {
    return this.databaseConfig.storage;
  }

  get maxStorage(): DatabaseServiceConfig["maxStorage"] {
    return this.databaseConfig.maxStorage;
  }

  get private(): DatabaseServiceConfig["private"] {
    return this.databaseConfig.private;
  }

  get deletionProtection(): DatabaseServiceConfig["deletionProtection"] {
    return this.databaseConfig.deletionProtection;
  }

  get port(): DatabaseServiceConfig["port"] {
    return this.databaseConfig.port;
  }

  addEnvVariables(...envVariables: EnvVariable[]): DatabaseService {
    super.addEnvVariables(...envVariables);
    return this;
  }
}

export const buildDatabaseService = (
  context: BuildContext,
  service: DatabaseService,
): ReturnType<typeof buildBaseService> & {
  [K in keyof Omit<DatabaseServiceConfig, "envVariables" | "fromService">]: ExtractValueType<DatabaseServiceConfig[K]>;
} => {
  const evaluator = context.getEvaluator();

  const { envVariables, ...baseService } = buildBaseService(context, service);

  return {
    ...baseService,
    engine: evaluator<DatabaseServiceConfig["engine"]>(service.engine),
    engineVersion: evaluator<DatabaseServiceConfig["engineVersion"]>(service.engineVersion),
    applyChangesImmediately: evaluator<DatabaseServiceConfig["applyChangesImmediately"]>(
      service.applyChangesImmediately,
    ),
    autoUpgradeMinorVersions: evaluator<DatabaseServiceConfig["autoUpgradeMinorVersions"]>(
      service.autoUpgradeMinorVersions,
    ),
    instanceSize: evaluator<DatabaseServiceConfig["instanceSize"]>(service.instanceSize),
    storage: evaluator<DatabaseServiceConfig["storage"]>(service.storage),
    maxStorage: evaluator<DatabaseServiceConfig["maxStorage"]>(service.maxStorage),
    private: evaluator<DatabaseServiceConfig["private"]>(service.private),
    deletionProtection: evaluator<DatabaseServiceConfig["deletionProtection"]>(service.deletionProtection),
    port: evaluator<DatabaseServiceConfig["port"]>(service.port),
    envVariables,
  };
};

export default DatabaseService;
