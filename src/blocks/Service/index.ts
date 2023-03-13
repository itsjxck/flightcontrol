import BuildContext from "../../context";
import DatabaseService, { buildDatabaseService } from "./Database";
import FargateService, { buildFargateService } from "./Fargate";
import Service from "./Service";
import StaticService, { buildStaticService } from "./Static";

const buildService = (
  context: BuildContext,
  service: Service,
):
  | ReturnType<typeof buildFargateService>
  | ReturnType<typeof buildStaticService>
  | ReturnType<typeof buildDatabaseService> => {
  switch (service.type) {
    case "fargate":
      return buildFargateService(context, service as FargateService);
    case "static":
      return buildStaticService(context, service as StaticService);
    case "rds":
      return buildDatabaseService(context, service as DatabaseService);
    default:
      throw new Error(`Unknown service type: ${service.type}`);
  }
};

export const buildServices = (context: BuildContext, services?: Service[]) =>
  services?.map((service) => buildService(context, service)) || undefined;

export { default as FargateService } from "./Fargate";
export { default as StaticService } from "./Static";
export { default as DatabaseService } from "./Database";
export default Service;
