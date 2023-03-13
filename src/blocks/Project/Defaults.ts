import { EnvironmentRegion } from "../Environment/Regions";

export type ProjectDefaultsConfig = {
  region?: EnvironmentRegion;
};

class ProjectDefaults {
  constructor(private config: ProjectDefaultsConfig) {}

  get region(): ProjectDefaultsConfig["region"] {
    return this.config.region;
  }

  set region(region: ProjectDefaultsConfig["region"]) {
    this.config.region = region;
  }
}

export default ProjectDefaults;
