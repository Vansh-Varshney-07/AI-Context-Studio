import type { GenerationContext, GenerationOptions, GenerationResult, ProviderConfig, GenerationOutputKind } from "./types";
import { BaseProvider, type StreamChunkHandler } from "./base-provider";

export class GoogleProvider extends BaseProvider {
  readonly id = "gemini";
  readonly label = "Google Gemini";
  readonly models = ["gemini-2.0-flash-exp", "gemini-1.5-pro", "gemini-1.5-flash"];
  readonly defaultModel = "gemini-2.0-flash-exp";

  validateApiKey(apiKey: string): boolean {
    return apiKey.length > 10;
  }

  async testConnection(apiKey: string, model?: string): Promise<boolean> {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model ?? this.defaultModel}?key=${apiKey}`,
      );
      return res.ok;
    } catch {
      return false;
    }
  }

  async generate(
    ctx: GenerationContext,
    options?: GenerationOptions,
    kind: GenerationOutputKind = "system-prompt"
  ): Promise<GenerationResult> {
    if (!this.config) throw new Error("Google provider not configured");

    const model = options?.model ?? this.config.model ?? this.defaultModel;
    const systemPrompt = this.buildSystemPrompt(ctx, kind);
    const userPrompt = this.buildUserPrompt(ctx, kind);

    const payload = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 4096,
      },
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Google API error: ${res.status} - ${err.error?.message ?? "Unknown error"}`);
    }

    // Handle streaming
    if (options?.stream && options.onStream) {
      return this.handleStreaming(res, options.onStream, kind);
    }

    const data = await res.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return { kind, title: `Generated ${this.getKindLabel(kind)}`, content };
  }

  private async handleStreaming(res: Response, onStream: StreamChunkHandler, kind: GenerationOutputKind): Promise<GenerationResult> {
    const content = await this.consumeSSEStream(
      res,
      onStream,
      (data: string) => {
        try {
          const parsed = JSON.parse(data);
          return parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
        } catch {
          return null;
        }
      }
    );

    return { kind, title: `Generated ${this.getKindLabel(kind)}`, content };
  }
}
