"use client";

import * as React from "react";
import { useProviderStore } from "@/shared/lib/provider-store";
import { getProvider } from "@/shared/services/providers/registry";
import { renderBlueprint, listBlueprints, type EngineOutput, type EngineBlueprint } from "@/features/system-prompt-engine";
import type { GenerationContext, GenerationOptions, GenerationResult, GenerationOutputKind } from "@/shared/services/providers/types";
import type { EngineAnswers, EngineFieldId } from "@/features/system-prompt-engine/types";

/**
 * Convert EngineAnswers value to string for GenerationContext.
 * Handles string, string[], boolean, undefined.
 */
function answerToString(value: EngineAnswers[EngineFieldId]): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

/**
 * Hook for the LOCAL engine only (no AI).
 * Synchronous â€” calls pure renderBlueprint directly.
 */
export function useLocalEngine(): {
  generate: (kind: GenerationOutputKind, answers: EngineAnswers) => EngineOutput | null;
  lastOutput: EngineOutput | null;
  error: string | null;
  clear: () => void;
} {
  const [lastOutput, setLastOutput] = React.useState<EngineOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const generate = React.useCallback(
    (kind: GenerationOutputKind, answers: EngineAnswers): EngineOutput | null => {
      setError(null);
      try {
        const output = renderBlueprint(kind, answers);
        setLastOutput(output);
        return output;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Generation failed";
        setError(msg);
        return null;
      }
    },
    [],
  );

  const clear = React.useCallback(() => {
    setLastOutput(null);
    setError(null);
  }, []);

  return { generate, lastOutput, error, clear };
}

/**
 * Hook for AI-ENHANCED generation.
 * Flow: local blueprint â†’ send to configured AI provider â†’ return refined result.
 *
 * Uses the active provider from provider-store (Zustand).
 * Falls back to local engine if no provider configured.
 */
export function useAIEngine(): {
  generate: (
    kind: GenerationOutputKind,
    answers: EngineAnswers,
    options?: {
      stream?: boolean;
      onStream?: (chunk: string) => void;
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ) => Promise<EngineOutput | null>;
  isGenerating: boolean;
  isStreaming: boolean;
  lastOutput: EngineOutput | null;
  error: string | null;
  clear: () => void;
  hasProvider: boolean;
  activeProviderId: string;
} {
  const { activeProviderId, apiKeys } = useProviderStore();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [lastOutput, setLastOutput] = React.useState<EngineOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const generate = React.useCallback(
    async (
      kind: GenerationOutputKind,
      answers: EngineAnswers,
      options?: {
        stream?: boolean;
        onStream?: (chunk: string) => void;
        model?: string;
        temperature?: number;
        maxTokens?: number;
      }
    ): Promise<EngineOutput | null> => {
      setIsGenerating(true);
      setIsStreaming(options?.stream ?? false);
      setError(null);

      // 1. Always run local blueprint first
      const localOutput = renderBlueprint(kind, answers);
      if (!localOutput) {
        setError("No content generated from local blueprint (all answers empty)");
        setIsGenerating(false);
        setIsStreaming(false);
        return null;
      }

      // 2. If no provider configured, return local output
      const apiKey = apiKeys[activeProviderId];
      if (!apiKey) {
        setLastOutput(localOutput);
        setIsGenerating(false);
        setIsStreaming(false);
        return localOutput;
      }

      // 3. Get provider and send to AI
      const provider = getProvider(activeProviderId);
      if (!provider) {
        setError(`Provider "${activeProviderId}" not registered`);
        setIsGenerating(false);
        setIsStreaming(false);
        return localOutput;
      }

      provider.configure({ apiKey, model: options?.model });

      const ctx: GenerationContext = {
        purpose: answerToString(answers.purpose),
        targetAI: answerToString(answers.targetAI),
        framework: answerToString(answers.framework),
        language: answerToString(answers.language),
        codingStyle: answerToString(answers.codingStyle),
        projectType: answerToString(answers.projectType),
        architecture: answerToString(answers.architecture),
        experienceLevel: answerToString(answers.experienceLevel),
        testingFramework: answerToString(answers.testingFramework),
        deploymentTarget: answerToString(answers.deploymentTarget),
        codingConventions: answerToString(answers.codingConventions),
        customInstructions: answerToString(answers.customInstructions),
        localBlueprint: localOutput.content,
      };

      const genOptions: GenerationOptions = {
        model: options?.model,
        temperature: options?.temperature ?? 0.7,
        maxTokens: options?.maxTokens ?? 8192,
        stream: options?.stream ?? false,
        onStream: options?.onStream,
      };

      try {
        const result: GenerationResult = await provider.generate(ctx, genOptions, kind);

        // Wrap AI result in EngineOutput shape
        const aiOutput: EngineOutput = {
          kind: result.kind,
          title: result.title,
          filename: localOutput.filename, // Keep local filename pattern
          content: result.content,
          consumedFields: localOutput.consumedFields,
        };

        setLastOutput(aiOutput);
        return aiOutput;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "AI generation failed";
        setError(msg);
        // Fallback to local output on AI error
        setLastOutput(localOutput);
        return localOutput;
      } finally {
        setIsGenerating(false);
        setIsStreaming(false);
      }
    },
    [activeProviderId, apiKeys],
  );

  const clear = React.useCallback(() => {
    setLastOutput(null);
    setError(null);
  }, []);

  return {
    generate,
    isGenerating,
    isStreaming,
    lastOutput,
    error,
    clear,
    hasProvider: Boolean(apiKeys[activeProviderId]),
    activeProviderId,
  };
}

/**
 * Convenience: list available blueprints for the OutputKind picker.
 */
export function useBlueprints() {
  return React.useMemo(() => listBlueprints(), []);
}

/**
 * Get a specific blueprint by kind.
 */
export function useBlueprint(kind: GenerationOutputKind) {
  return React.useMemo(() => {
    const blueprints = listBlueprints();
    return blueprints.find((b) => b.kind === kind);
  }, [kind]);
}

/**
 * Get all blueprints as a map for quick lookup.
 */
export function useBlueprintMap() {
  return React.useMemo(() => {
    const blueprints = listBlueprints();
    const map = new Map<GenerationOutputKind, EngineBlueprint>();
    for (const bp of blueprints) map.set(bp.kind, bp);
    return map;
  }, []);
}
