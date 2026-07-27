/**
 * Base interfaces and types for pluggable validators.
 */

import type { AssetType, ValidationFinding, ValidationCategory, ValidationInput, ValidationResult, ValidationOptions } from "@/features/validator/types";

/**
 * Interface that all validators must implement.
 */
export interface IAssetValidator {
  /**
   * Unique identifier for this validator.
   */
  readonly id: string;
  
  /**
   * Human-readable name.
   */
  readonly name: string;
  
  /**
   * Description of what this validator checks.
   */
  readonly description: string;
  
  /**
   * Asset types this validator supports.
   */
  readonly supportedTypes: AssetType[];
  
  /**
   * Configure the validator with optional settings.
   */
  configure(config: ValidatorConfig): void;
  
  /**
   * Run validation on the input.
   */
  validate(input: ValidationInput): Promise<ValidationResult>;
  
  /**
   * Quick sync check if this validator can handle the input.
   */
  canValidate(input: ValidationInput): boolean;
}

/**
 * Configuration for a validator instance.
 */
export interface ValidatorConfig {
  /**
   * Enable/disable specific categories.
   */
  enabledCategories?: ValidationCategory[];
  
  /**
   * Strict mode - treat warnings as errors.
   */
  strict?: boolean;
  
  /**
   * Custom thresholds.
   */
  thresholds?: Record<string, number>;
  
  /**
   * Asset-specific options.
   */
  assetOptions?: Record<string, unknown>;
}

/**
 * Base class for validators providing common functionality.
 */
export abstract class BaseValidator implements IAssetValidator {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly supportedTypes: AssetType[];
  
  protected config: ValidatorConfig = {};
  
  configure(config: ValidatorConfig): void {
    this.config = { ...this.config, ...config };
  }
  
  canValidate(input: ValidationInput): boolean {
    const assetType = input.assetType ?? "instruction-file";
    return this.supportedTypes.includes(assetType);
  }
  
  async validate(input: ValidationInput): Promise<ValidationResult> {
    const assetType = input.assetType ?? "instruction-file";
    if (!this.canValidate(input)) {
      return {
        assetType: input.assetType ?? "instruction-file",
        valid: false,
        score: { overall: 0, maxScore: 100, breakdown: [], grade: "F" },
        findings: [{
          id: this.generateId(),
          category: "structure",
          severity: "error",
          title: "Unsupported asset type",
          description: `Validator ${this.id} does not support asset type ${assetType}`,
          suggestion: "Use a validator that supports this asset type",
        }],
        strengths: [],
        weaknesses: [],
        missingSections: [],
        improvementSuggestions: [],
        estimatedAIPerformance: "poor",
        estimatedTokenEfficiency: "low",
        compatibility: [],
        recommendations: [],
        metadata: {
          validatedAt: new Date().toISOString(),
          validatorVersion: "1.0.0",
          inputMethod: input.method ?? "paste",
          contentLength: input.content.length,
        },
      };
    }
    
    return this.performValidation(input);
  }
  
  /**
   * Subclasses implement this to do the actual validation.
   */
  protected abstract performValidation(input: ValidationInput): Promise<ValidationResult>;
  
  /**
   * Generate a unique ID for findings.
   */
  protected generateId(): string {
    return `${this.id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  
  /**
   * Create a standardized finding.
   */
  protected createFinding(params: {
    category: ValidationCategory;
    severity: "error" | "warning" | "info" | "success";
    title: string;
    description: string;
    suggestion?: string;
    location?: { line?: number; column?: number; section?: string };
    evidence?: string;
  }): {
    id: string;
    category: ValidationCategory;
    severity: "error" | "warning" | "info" | "success";
    title: string;
    description: string;
    suggestion?: string;
    location?: { line?: number; column?: number; section?: string };
    evidence?: string;
  } {
    return {
      id: this.generateId(),
      ...params,
    };
  }
  
  /**
   * Check if a category is enabled.
   */
  protected isCategoryEnabled(category: string): boolean {
    if (!this.config.enabledCategories) return true;
    return this.config.enabledCategories.includes(category as any);
  }
}

/**
 * Validator registry for managing multiple validators.
 */
export class ValidatorRegistry {
  private validators: Map<string, IAssetValidator> = new Map();
  private defaultValidator?: IAssetValidator;
  
  register(validator: IAssetValidator): void {
    this.validators.set(validator.id, validator);
    
    // Set as default if it supports the most types
    if (!this.defaultValidator || validator.supportedTypes.length > this.defaultValidator.supportedTypes.length) {
      this.defaultValidator = validator;
    }
  }
  
  unregister(id: string): void {
    this.validators.delete(id);
  }
  
  get(id: string): IAssetValidator | undefined {
    return this.validators.get(id);
  }
  
  getAll(): IAssetValidator[] {
    return Array.from(this.validators.values());
  }
  
  getForAssetType(assetType: string): IAssetValidator[] {
    return this.getAll().filter(v => v.supportedTypes.includes(assetType as any));
  }
  
  getBestForAssetType(assetType: string): IAssetValidator | undefined {
    const candidates = this.getForAssetType(assetType);
    if (candidates.length === 0) return this.defaultValidator;
    
    // Return the one with most specific support (fewest types = more specialized)
    return candidates.reduce((best, current) => 
      current.supportedTypes.length < best.supportedTypes.length ? current : best
    );
  }
  
  configureAll(config: ValidatorConfig): void {
    for (const validator of this.validators.values()) {
      validator.configure(config);
    }
  }
}

/**
 * Global validator registry instance.
 */
export const validatorRegistry = new ValidatorRegistry();

