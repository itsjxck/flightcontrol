import BuildContext from "../../context";
import Environment, { buildEnvironments } from "../Environment";
import EnvVariable, { buildEnvVariables } from "../EnvVariable";
import Service from "../Service";
import ProjectDefaults, { ProjectDefaultsConfig } from "./Defaults";

export type ProjectConfig = {
  defaults?: ProjectDefaultsConfig;
  environments?: Environment[];
  envVariables?: EnvVariable[];
};

class Project {
  private _defaults: ProjectDefaults;
  private _environments: Environment[];
  private _envVariables: EnvVariable[];

  constructor(config?: ProjectConfig) {
    this._defaults = new ProjectDefaults(config?.defaults || {});
    this._environments = config?.environments || [];
    this._envVariables = config?.envVariables || [];
  }

  get defaults(): ProjectDefaults {
    return this._defaults;
  }

  get environments(): Environment[] {
    return this._environments;
  }

  get envVariables(): EnvVariable[] {
    return this._envVariables;
  }

  addEnvironments(...environments: Environment[]): Project {
    this._environments.push(...environments);
    return this;
  }

  addEnvVariables(...envVariables: EnvVariable[]): Project {
    this._envVariables.push(...envVariables);
    return this;
  }

  addServicesToAllEnvironments(...services: Service[]): Project {
    this._environments.forEach((environment) => environment.addServices(...services));
    return this;
  }

  build() {
    const context = new BuildContext({
      project: this,
    });

    return {
      envVariables: buildEnvVariables(context, this.envVariables),
      environments: buildEnvironments(context, this.environments),
    };
  }
}

export default Project;
