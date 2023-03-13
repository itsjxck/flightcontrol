import BuildContext from "../../context";
import EnvVariable, { EnvVariableConfig, EnvVariableConfigInput } from "./EnvVariable";

export type FromParameterStoreEnvVariableConfig = EnvVariableConfig;
export type FromParameterStoreEnvVariableConfigInput = EnvVariableConfigInput;

export type BuiltFromParameterStoreEnvVariableConfig = Record<
  FromParameterStoreEnvVariableConfig["name"],
  { fromParameterStore: FromParameterStoreEnvVariableConfig["value"] }
>;

class FromParameterStoreEnvVariable extends EnvVariable {
  constructor(private fromParameterStoreConfig: FromParameterStoreEnvVariableConfigInput) {
    super({ type: "fromParameterStore", ...fromParameterStoreConfig });
  }
}

export const buildFromParameterStoreEnvVariable = (
  context: BuildContext,
  envVariable: FromParameterStoreEnvVariable,
): BuiltFromParameterStoreEnvVariableConfig => {
  const evaluator = context.getEvaluator();

  return {
    [evaluator<FromParameterStoreEnvVariableConfig["name"]>(envVariable.name)]: {
      fromParameterStore: evaluator<BuiltFromParameterStoreEnvVariableConfig[string]["fromParameterStore"]>(
        envVariable.value,
      ),
    },
  };
};

export default FromParameterStoreEnvVariable;
