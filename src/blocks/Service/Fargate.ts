import Service, { buildBaseService, ServiceBuildType, ServiceConfig } from "./Service";
import BuildContext, { ExtractValueType, ValueOrFunctionWithBuildContext } from "../../context";
import EnvVariable from "../EnvVariable";

export type FargateServiceType = "fargate";

export type FargateServiceCPUOptions = 0.25 | 0.5 | 1 | 2 | 4;

export type FargateServiceConfig = Omit<ServiceConfig, "type"> & {
  cpu: ValueOrFunctionWithBuildContext<FargateServiceCPUOptions>;
  memory: ValueOrFunctionWithBuildContext<number>;
  storage?: ValueOrFunctionWithBuildContext<number>;
  minInstances?: ValueOrFunctionWithBuildContext<number>;
  maxInstances?: ValueOrFunctionWithBuildContext<number>;
  domain?: ValueOrFunctionWithBuildContext<string>;
  port: ValueOrFunctionWithBuildContext<number>;
  healthCheckPath?: ValueOrFunctionWithBuildContext<string>;
} & (
    | {
        buildType?: ServiceBuildType<"nodejs">;
        postBuildCommand?: ValueOrFunctionWithBuildContext<string>;
      }
    | {
        buildType: ServiceBuildType<"nixpacks" | "nodejs">;
        installCommand?: ValueOrFunctionWithBuildContext<string>;
        buildCommand?: ValueOrFunctionWithBuildContext<string>;
        startCommand?: ValueOrFunctionWithBuildContext<string>;
      }
    | {
        buildType: ServiceBuildType<"nixpacks">;
        basePath?: ValueOrFunctionWithBuildContext<string>;
      }
    | {
        buildType: ServiceBuildType<"fromService">;
        fromService: ValueOrFunctionWithBuildContext<Service>;
      }
    | {
        buildType: ServiceBuildType<"fromRepository">;
        containerImage: ValueOrFunctionWithBuildContext<{
          registryId: string;
          repository: string;
          tag?: string;
        }>;
      }
    | {
        buildType: ServiceBuildType<"docker">;
        dockerfilePath: ValueOrFunctionWithBuildContext<string>;
        dockerContext?: ValueOrFunctionWithBuildContext<string>;
      }
  );

export type ExtractConfigByBuildType<T extends FargateServiceConfig["buildType"]> = Extract<
  FargateServiceConfig,
  { buildType: T }
>;

class FargateService extends Service {
  constructor(private fargateConfig: FargateServiceConfig) {
    super({ ...fargateConfig, type: "fargate" });
    if ("fromService" in fargateConfig) this.fargateConfig.buildType = "fromService";
    if ("containerImage" in fargateConfig) this.fargateConfig.buildType = "fromRepository";
    if ("dockerfilePath" in fargateConfig) this.fargateConfig.buildType = "docker";
  }

  get buildType(): FargateServiceConfig["buildType"] {
    return this.fargateConfig.buildType;
  }

  get cpu(): FargateServiceConfig["cpu"] {
    return this.fargateConfig.cpu;
  }

  get memory(): FargateServiceConfig["memory"] {
    return this.fargateConfig.memory;
  }

  get storage(): FargateServiceConfig["storage"] {
    return this.fargateConfig.storage;
  }

  get minInstances(): FargateServiceConfig["minInstances"] {
    return this.fargateConfig.minInstances;
  }

  get maxInstances(): FargateServiceConfig["maxInstances"] {
    return this.fargateConfig.maxInstances;
  }

  get domain(): FargateServiceConfig["domain"] {
    return this.fargateConfig.domain;
  }

  get port(): FargateServiceConfig["port"] {
    return this.fargateConfig.port;
  }

  get healthCheckPath(): FargateServiceConfig["healthCheckPath"] {
    return this.fargateConfig.healthCheckPath;
  }

  get fromService(): ExtractConfigByBuildType<"fromService">["fromService"] | undefined {
    if (this.fargateConfig.buildType !== "fromService") return undefined;
    return this.fargateConfig.fromService;
  }

  get containerImage(): ExtractConfigByBuildType<"fromRepository">["containerImage"] | undefined {
    if (this.fargateConfig.buildType !== "fromRepository") return undefined;
    return this.fargateConfig.containerImage;
  }

  get dockerfilePath(): ExtractConfigByBuildType<"docker">["dockerfilePath"] | undefined {
    if (this.fargateConfig.buildType !== "docker") return undefined;
    return this.fargateConfig.dockerfilePath;
  }

  get dockerContext(): ExtractConfigByBuildType<"docker">["dockerContext"] | undefined {
    if (this.fargateConfig.buildType !== "docker") return undefined;
    return this.fargateConfig.dockerContext;
  }

  addEnvVariables(...envVariables: EnvVariable[]): FargateService {
    super.addEnvVariables(...envVariables);
    return this;
  }
}

export const buildFargateService = (
  context: BuildContext,
  service: FargateService,
): ReturnType<typeof buildBaseService> & {
  [K in keyof Omit<FargateServiceConfig, "envVariables" | "fromService">]: ExtractValueType<FargateServiceConfig[K]>;
} & {
  fromService?: string;
  containerImage?: ExtractValueType<ExtractConfigByBuildType<"fromRepository">["containerImage"]>;
  dockerfilePath?: ExtractValueType<ExtractConfigByBuildType<"docker">["dockerfilePath"]>;
  dockerContext?: ExtractValueType<ExtractConfigByBuildType<"docker">["dockerContext"]>;
} => {
  const evaluator = context.getEvaluator();

  const { envVariables, ...baseService } = buildBaseService(context, service);

  return {
    ...baseService,
    buildType: evaluator<FargateServiceConfig["buildType"]>(service.buildType),
    cpu: evaluator<FargateServiceConfig["cpu"]>(service.cpu),
    memory: evaluator<FargateServiceConfig["memory"]>(service.memory),
    storage: evaluator<FargateServiceConfig["storage"]>(service.storage),
    minInstances: evaluator<FargateServiceConfig["minInstances"]>(service.minInstances),
    maxInstances: evaluator<FargateServiceConfig["maxInstances"]>(service.maxInstances),
    domain: evaluator<FargateServiceConfig["domain"]>(service.domain),
    port: evaluator<FargateServiceConfig["port"]>(service.port),
    healthCheckPath: evaluator<FargateServiceConfig["healthCheckPath"]>(service.healthCheckPath),
    fromService: service.fromService
      ? evaluator<ExtractConfigByBuildType<"fromService">["fromService"]>(service.fromService)?.id
      : undefined,
    containerImage: service.containerImage
      ? evaluator<ExtractConfigByBuildType<"fromRepository">["containerImage"]>(service.containerImage)
      : undefined,
    dockerfilePath: service.dockerfilePath
      ? evaluator<ExtractConfigByBuildType<"docker">["dockerfilePath"]>(service.dockerfilePath)
      : undefined,
    dockerContext: service.dockerContext
      ? evaluator<ExtractConfigByBuildType<"docker">["dockerContext"]>(service.dockerContext)
      : undefined,
    envVariables,
  };
};

export default FargateService;
