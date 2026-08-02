import type {
  OptimizationInput,
  OptimizationResult,
  OptimizationType,
  OptimizationOptions,
  PromptType,
  TargetModel,
  OptimizationMode,
  IOptimizationEngine,
} from "@/lib/optimizer/types";
import { OptimizationEngineRegistry } from "./registry";

// Import engines
import { ClarityOptimizationEngine } from "./clarity";
import { ConcisenessOptimizationEngine } from "./conciseness";
import { RoleDefinitionEngine } from "./role-definition";
import { ChainOfThoughtEngine } from "./chain-of-thought";
import { TokenReductionEngine } from "./token-reduction";

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
      new RoleDefinitionEngine(),
      new ChainOfThoughtEngine(),
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
      const result = await engine.optimize(engineInput);
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