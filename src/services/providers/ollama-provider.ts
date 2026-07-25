import type { GenerationContext, GenerationOptions, GenerationResult, ProviderConfig, GenerationOutputKind } from "./types";
import { BaseProvider } from "./base-provider";

export class OllamaProvider extends BaseProvider {
  readonly id = "ollama";
  readonly label = "Local Ollama";
  readonly models = ["llama3.1:70b", "llama3.1:8b", "codellama:34b", "codellama:13b", "qwen2.5-coder:32b"];
  readonly defaultModel = "llama3.1:70b";

  validateApiKey(_apiKey: string): boolean {
    return true;
  }

  async testConnection(_apiKey: string, model?: string): Promise<boolean> {
    try {
      const endpoint = this.config?.baseUrl ?? "http://localhost:11434";
      const res = await fetch(`${endpoint}/api/tags`);
      if (!res.ok) return false;
      const data = await res.json();
      const modelPrefix = (model ?? this.defaultModel.split(":")[0]) as string;
      return data.models?.some((m: { name: string }) => m.name.startsWith(modelPrefix)) ?? false;
    } catch {
      return false;
    }
  }

  async generate(
    ctx: GenerationContext,
    options?: GenerationOptions,
    kind: GenerationOutputKind = "system-prompt"
  ): Promise<GenerationResult> {
    if (!this.config) throw new Error("Ollama provider not configured");

    const endpoint = this.config.baseUrl ?? "http://localhost:11434";
    const model = options?.model ?? this.config.model ?? this.defaultModel;
    const systemPrompt = this.buildSystemPrompt(ctx, kind);
    const userPrompt = this.buildUserPrompt(ctx, kind);

    const payload = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: options?.stream ?? false,
      options: {
        temperature: options?.temperature ?? 0.7,
        num_predict: options?.maxTokens ?? 4096,
      },
    };

    const res = await fetch(`${endpoint}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Ollama API error: ${res.status} - ${err.error ?? "Unknown error"}`);
    }

    if (options?.stream && options.onStream) {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(Boolean);
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              const delta = parsed.message?.content ?? "";
              if (delta) {
                fullContent += delta;
                options.onStream(delta);
              }
              if (parsed.done) break;
            } catch {}
          }
        }
      }

      return { kind, title: `Generated ${this.getKindLabel(kind)}`, content: fullContent };
    }

    const data = await res.json();
    const content = data.message?.content ?? "";

    return { kind, title: `Generated ${this.getKindLabel(kind)}`, content };
  }
}