/**
 * Main Optimization Service
 * Orchestrates all optimization engines.
 */

import type {
  OptimizationInput,
  OptimizationResult,
  OptimizationType,
  OptimizationOptions,
  PromptType,
  TargetModel,
  OptimizationMode,
} from "@/features/optimizer/types";
import type { BaseOptimizationEngine, IOptimizationEngine } from "../engines/base";

import { ClarityOptimizationEngine } from "../engines/clarity";
import { ConcisenessOptimizationEngine } from "../engines/conciseness";
import { ContextExpansionEngine } from "../engines/context-expansion";
import { RoleDefinitionEngine } from "../engines/role-definition";
import { ConstraintOptimizationEngine } from "../engines/constraint";
import { OutputFormattingEngine } from "../engines/output-formatting";
import { ChainOfThoughtEngine } from "../engines/cot";
import { ReasoningEngine } from "../engines/reasoning";
import { ToolUsageEngine } from "../engines/tool-usage";
import { SafetyOptimizationEngine } from "../engines/safety";
import { WorkflowCompletenessEngine } from "../engines/workflow-completeness";
import { MemoryStrategyEngine } from "../engines/memory-strategy";
import { CostOptimizationEngine } from "../engines/cost";
import { PerformanceOptimizationEngine } from "../engines/performance";
import { PromptEngineeringEngine } from "../engines/prompt-engineering";
import { TokenReductionEngine } from "../engines/token-reduction";

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

/**
 * Main Optimization Service. Orchestrates engines.
 */
export class Optimizer {
  private static registry = new OptimizationEngineRegistry();
  private static initialized = false;

  static get engines(): OptimizationEngineRegistry {
    this.initialize();
    return this.registry;
  }

  static initialize(): void {
    if (this.initialized) return;

    const engines: IOptimizationEngine[] = [
      new ClarityOptimizationEngine(),
      new ConcisenessOptimizationEngine(),
      new ContextExpansionEngine(),
      new RoleDefinitionEngine(),
      new ConstraintOptimizationEngine(),
      new OutputFormattingEngine(),
      new ChainOfThoughtEngine(),
      new ReasoningEngine(),
      new ToolUsageEngine(),
      new SafetyOptimizationEngine(),
      new WorkflowCompletenessEngine(),
      new MemoryStrategyEngine(),
      new CostOptimizationEngine(),
      new PerformanceOptimizationEngine(),
      new PromptEngineeringEngine(),
      new TokenReductionEngine(),
    ];

    for (const engine of engines) this.registry.register(engine);

    this.initialized = true;
  }

  static async optimize(input: {
    content: string;
    promptType?: PromptType;
    targetModel?: TargetModel;
    optimizationTypes?: OptimizationType[];
    mode?: OptimizationMode;
    temperature?: number;
    maxTokens?: number;
    outputStyle?: "concise" | "detailed" | "structured" | "conversational";
    reasoningStyle?: "step-by-step" | "structured" | "intuitive" | "minimal";
    strictness?: "lenient" | "balanced" | "strict";
    verbosity?: "concise" | "normal" | "verbose";
    targetAudience?: "expert" | "intermediate" | "beginner";
    preserveOriginal?: boolean;
  }): Promise<OptimizationResult> {
    this.initialize();

    const opts: OptimizationOptions = {
      promptType: input.promptType ?? "general-prompt",
      targetModel: input.targetModel ?? "claude",
      optimizationTypes: input.optimizationTypes ?? ["clarity"],
      mode: input.mode ?? "general",
      temperature: input.temperature,
      maxTokens: input.maxTokens,
      outputStyle: input.outputStyle,
      reasoningStyle: input.reasoningStyle,
      strictness: input.strictness,
      verbosity: input.verbosity,
      targetAudience: input.targetAudience,
      preserveOriginal: input.preserveOriginal,
    };

    const optimizationInput: OptimizationInput = {
      content: input.content,
      options: opts,
    };

    const types = opts.optimizationTypes.map(String);
    const matchingEngines = this.registry.forTypes(types);

    if (matchingEngines.length === 0) {
      throw new Error(`No engines available for types: ${types.join(", ")}`);
    }

    let current = input.content;
    let lastResult: OptimizationResult | null = null;

    for (const engine of matchingEngines) {
      const engineInput: OptimizationInput = {
        content: current,
        options: opts,
      };
      if (!engine.canOptimize(engineInput)) continue;
      const result = (await engine.optimize(engineInput)) as OptimizationResult;
      lastResult = result;
      current = result.optimizedPrompt;
    }

    if (lastResult) {
      return {
        ...lastResult,
        originalPrompt: input.content,
        optimizedPrompt: current,
      } as OptimizationResult;
    }

    throw new Error("Optimization failed: no engine produced a usable result.");
  }

  static getEngines(): IOptimizationEngine[] {
    this.initialize();
    return this.registry.getAll();
  }
}

Optimizer.initialize();
