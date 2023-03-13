import BuildContext from "../../context";
import { buildServices } from "../Service";
import Environment from "./Environment";

const buildEnvironment = (context: BuildContext, environment: Environment) => {
  const environmentContext = new BuildContext({
    project: context.project,
    environment,
  });

  const region = environment.region || context.project.defaults.region;

  if (!region)
    throw new Error(
      `No region specified for environment ${environment.id}. Either provide a default region in the project or specify a region for the environment.`,
    );

  return {
    id: environment.id,
    name: environment.name || environment.id,
    region,
    services: buildServices(environmentContext, environment.services),
  };
};

export const buildEnvironments = (context: BuildContext, environments?: Environment[]) =>
  environments?.map((environment) => buildEnvironment(context, environment));

export default Environment;
