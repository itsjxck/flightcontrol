import Service, { buildBaseService, ServiceConfig } from "./Service";
import BuildContext, { ExtractValueType, ValueOrFunctionWithBuildContext } from "../../context";
import EnvVariable from "../EnvVariable";

export type StaticServiceType = "static";

export type StaticServiceConfig = Omit<ServiceConfig, "type"> & {
  domain?: ValueOrFunctionWithBuildContext<string>;
  singlePageApp?: ValueOrFunctionWithBuildContext<boolean>;
  installCommand?: ValueOrFunctionWithBuildContext<string>;
  buildCommand?: ValueOrFunctionWithBuildContext<string>;
  outputDirectory?: ValueOrFunctionWithBuildContext<string>;
};

class StaticService extends Service {
  constructor(private staticConfig: StaticServiceConfig) {
    super({ ...staticConfig, type: "static" });
  }

  get domain(): StaticServiceConfig["domain"] {
    return this.staticConfig.domain;
  }

  get singlePageApp(): StaticServiceConfig["singlePageApp"] {
    return this.staticConfig.singlePageApp;
  }

  get installCommand(): StaticServiceConfig["installCommand"] {
    return this.staticConfig.installCommand;
  }

  get buildCommand(): StaticServiceConfig["buildCommand"] {
    return this.staticConfig.buildCommand;
  }

  get outputDirectory(): StaticServiceConfig["outputDirectory"] {
    return this.staticConfig.outputDirectory;
  }

  addEnvVariables(...envVariables: EnvVariable[]): StaticService {
    super.addEnvVariables(...envVariables);
    return this;
  }
}

export const buildStaticService = (
  context: BuildContext,
  service: StaticService,
): ReturnType<typeof buildBaseService> & {
  [K in keyof Omit<StaticServiceConfig, "envVariables" | "fromService">]: ExtractValueType<StaticServiceConfig[K]>;
} => {
  const evaluator = context.getEvaluator();

  const { envVariables, ...baseService } = buildBaseService(context, service);

  return {
    ...baseService,
    domain: evaluator<StaticServiceConfig["domain"]>(service.domain),
    singlePageApp: evaluator<StaticServiceConfig["singlePageApp"]>(service.singlePageApp),
    installCommand: evaluator<StaticServiceConfig["installCommand"]>(service.installCommand),
    buildCommand: evaluator<StaticServiceConfig["buildCommand"]>(service.buildCommand),
    outputDirectory: evaluator<StaticServiceConfig["outputDirectory"]>(service.outputDirectory),
    envVariables,
  };
};

export default StaticService;
