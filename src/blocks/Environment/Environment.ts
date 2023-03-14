import Service from "../Service";
import { EnvironmentRegion } from "./Regions";

export type EnvironmentConfig = {
  id: string;
  name?: string;
  region?: EnvironmentRegion;
  source: {
    branch: string;
    trigger?: "manual" | "push";
    pr?: true;
    filter?: {
      toBranches?: string[];
      fromBranches?: string[];
      labels?: string[];
    };
  };
  services?: Service[];
};

class Environment {
  private _services?: Service[];

  constructor(private config: EnvironmentConfig) {
    this._services = config.services;
  }

  get id(): EnvironmentConfig["id"] {
    return this.config.id;
  }

  get name(): EnvironmentConfig["name"] {
    return this.config.name;
  }

  get region(): EnvironmentConfig["region"] {
    return this.config.region;
  }

  get source(): EnvironmentConfig["source"] {
    return this.config.source;
  }

  get services(): EnvironmentConfig["services"] {
    return this._services;
  }

  addServices(...services: Service[]): Environment {
    if (this._services === undefined) this._services = [];
    this._services.push(...services);
    return this;
  }
}

export default Environment;
