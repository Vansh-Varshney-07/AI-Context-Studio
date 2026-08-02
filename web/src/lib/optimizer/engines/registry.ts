import type {
  OptimizationInput,
  OptimizationResult,
  IOptimizationEngine,
} from "@/lib/optimizer/types";

/**
 * Registry of optimization engines.
 */
export class OptimizationEngineRegistry {
  private engines = new Map<string, IOptimizationEngine>();

  register(engine: IOptimizationEngine): void {
    this.engines.set(engine.id, engine);
  }

  get(id: string): IOptimizationEngine | undefined {
    return this.engines.get(id);
  }

  getAll(): IOptimizationEngine[] {
    return Array.from(this.engines.values());
  }

  forTypes(types: string[]): IOptimizationEngine[] {
    return this.getAll().filter((engine) =>
      engine.supportedTypes.some((t) => types.includes(t as string))
    );
  }
}