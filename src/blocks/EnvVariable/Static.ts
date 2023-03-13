import EnvVariable, { EnvVariableConfig, EnvVariableConfigInput } from "./EnvVariable";
import BuildContext from "../../context";

export type StaticEnvVariableConfig = EnvVariableConfig;
export type StaticEnvVariableConfigInput = EnvVariableConfigInput;
export type BuiltStaticEnvVariableConfig = Record<StaticEnvVariableConfig["name"], StaticEnvVariableConfig["value"]>;

class StaticEnvVariable extends EnvVariable {
  constructor(private staticConfig: StaticEnvVariableConfigInput) {
    super({ type: "static", ...staticConfig });
  }
}

export const buildStaticEnvVariable = (
  context: BuildContext,
  envVariable: StaticEnvVariable,
): BuiltStaticEnvVariableConfig => {
  const evaluator = context.getEvaluator();

  return {
    [evaluator<StaticEnvVariableConfig["name"]>(envVariable.name)]: evaluator<BuiltStaticEnvVariableConfig[string]>(
      envVariable.value,
    ),
  };
};

export default StaticEnvVariable;
