import Service from "../Service";
import { EnvironmentRegion } from "./Regions";

export type EnvironmentConfig = {
  id: string;
  name?: string;
  region?: EnvironmentRegion;
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
