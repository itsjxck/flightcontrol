import { FunctionWithBuildContext } from "../../context";

export type EnvVariableType = "static" | "fromParameterStore" | "fromService";

export type EnvVariableConfig = {
  name: string;
  value: string;
};

export type EnvVariableConfigInput = {
  [K in keyof EnvVariableConfig]: EnvVariableConfig[K] | FunctionWithBuildContext<EnvVariableConfig[K]>;
};

abstract class EnvVariable {
  readonly type: EnvVariableType;
  constructor(private config: EnvVariableConfigInput & { type: EnvVariableType }) {
    this.type = config.type;
  }

  get name(): EnvVariableConfigInput["name"] {
    return this.config.name;
  }

  get value(): EnvVariableConfigInput["value"] {
    return this.config.value;
  }
}

export default EnvVariable;
