import Environment from "./blocks/Environment";
import Project from "./blocks/Project";

export type BuildContextConfig = {
  project: Project;
  environment?: Environment;
};

export type FunctionWithBuildContext<T> = (context: BuildContext) => NonNullable<T>;
export type ValueOrFunctionWithBuildContext<T> = T | FunctionWithBuildContext<T>;
export type ExtractValueType<T> = Exclude<T, FunctionWithBuildContext<unknown>>;

class BuildContext {
  constructor(private context: BuildContextConfig) {}

  get project(): BuildContextConfig["project"] {
    return this.context.project;
  }

  get environment(): BuildContextConfig["environment"] {
    return this.context.environment;
  }

  static isEvaluatorFunction<T extends FunctionWithBuildContext<unknown>>(value: unknown): value is T {
    return typeof value === "function";
  }

  getEvaluator() {
    return <T extends ValueOrFunctionWithBuildContext<unknown>, E = ExtractValueType<T>>(
      value: E | FunctionWithBuildContext<E>,
    ): E => (BuildContext.isEvaluatorFunction(value) ? value(this) : value);
  }
}

export default BuildContext;
