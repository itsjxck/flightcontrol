import BuildContext from "../../context";
import EnvVariable from "./EnvVariable";
import FromParameterStoreEnvVariable, { buildFromParameterStoreEnvVariable } from "./FromParameterStore";
import FromServiceEnvVariable, { buildFromServiceEnvVariable } from "./FromService";
import StaticEnvVariable, { buildStaticEnvVariable } from "./Static";

export type BuiltEnvVariable =
  | ReturnType<typeof buildFromParameterStoreEnvVariable>
  | ReturnType<typeof buildFromServiceEnvVariable>
  | ReturnType<typeof buildStaticEnvVariable>;

const buildEnvVariable = (context: BuildContext, envVariable: EnvVariable): BuiltEnvVariable => {
  switch (envVariable.type) {
    case "fromParameterStore":
      return buildFromParameterStoreEnvVariable(context, envVariable as FromParameterStoreEnvVariable);
    case "fromService":
      return buildFromServiceEnvVariable(context, envVariable as FromServiceEnvVariable);
    case "static":
      return buildStaticEnvVariable(context, envVariable as StaticEnvVariable);
    default:
      throw new Error(`Unknown env variable type: ${envVariable.type}`);
  }
};

export const buildEnvVariables = (context: BuildContext, envVariables?: EnvVariable[]) =>
  envVariables
    ?.map((envVariable) => buildEnvVariable(context, envVariable))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {} as BuiltEnvVariable[]) || undefined;

export { default as FromParameterStoreEnvVariable } from "./FromParameterStore";
export { default as FromServiceEnvVariable } from "./FromService";
export { default as StaticEnvVariable } from "./Static";
export default EnvVariable;
