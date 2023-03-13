import EnvVariable from "./EnvVariable";
import BuildContext, { FunctionWithBuildContext } from "../../context";
import Service from "../Service";
import { EnvVariableConfig, EnvVariableConfigInput } from "./EnvVariable";

type FromServiceEnvVariableAdditionalConfig = {
  service: Service;
};

export type FromServiceEnvVariableConfig = EnvVariableConfig & FromServiceEnvVariableAdditionalConfig;

type FromServiceEnvVariableConfigInput = EnvVariableConfigInput & {
  [K in keyof FromServiceEnvVariableAdditionalConfig]:
    | FromServiceEnvVariableAdditionalConfig[K]
    | FunctionWithBuildContext<FromServiceEnvVariableAdditionalConfig[K]>;
};

export type BuiltFromServiceEnvVariableConfig = Record<
  FromServiceEnvVariableConfig["name"],
  {
    fromService: { id: FromServiceEnvVariableConfig["service"]["id"]; value: FromServiceEnvVariableConfig["value"] };
  }
>;

class FromServiceEnvVariable extends EnvVariable {
  constructor(private fromServiceConfig: FromServiceEnvVariableConfigInput) {
    super({ type: "fromService", ...fromServiceConfig });
  }

  get service(): FromServiceEnvVariableConfigInput["service"] {
    return this.fromServiceConfig.service;
  }
}

export const buildFromServiceEnvVariable = (
  context: BuildContext,
  envVariable: FromServiceEnvVariable,
): BuiltFromServiceEnvVariableConfig => {
  const evaluator = context.getEvaluator();

  return {
    [evaluator<FromServiceEnvVariableConfig["name"]>(envVariable.name)]: {
      fromService: {
        id: evaluator<FromServiceEnvVariableConfig["service"]>(envVariable.service).id,
        value: evaluator<FromServiceEnvVariableConfig["value"]>(envVariable.value),
      },
    },
  };
};

export default FromServiceEnvVariable;
