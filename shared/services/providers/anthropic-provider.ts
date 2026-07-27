import type { GenerationContext, GenerationOptions, GenerationResult, ProviderConfig, GenerationOutputKind } from "./types";
import { BaseProvider } from "./base-provider";

export class AnthropicProvider extends BaseProvider {
  readonly id = "claude";
  readonly label = "Anthropic Claude";
  readonly models = ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"];
  readonly defaultModel = "claude-3-5-sonnet-20241022";

  validateApiKey(apiKey: string): boolean {
    return apiKey.startsWith("sk-ant-") && apiKey.length > 20;
  }

  async testConnection(apiKey: string, model?: string): Promise<boolean> {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: model ?? this.defaultModel,
          max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }],
        }),
      });
      return res.ok || res.status === 400;
    } catch {
      return false;
    }
  }

  async generate(
    ctx: GenerationContext,
    options?: GenerationOptions,
    kind: GenerationOutputKind = "system-prompt"
  ): Promise<GenerationResult> {
    if (!this.config) throw new Error("Anthropic provider not configured");

    const model = options?.model ?? this.config.model ?? this.defaultModel;
    const systemPrompt = this.buildSystemPrompt(ctx, kind);
    const userPrompt = this.buildUserPrompt(ctx, kind);

    const payload = {
      model,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      stream: options?.stream ?? false,
    };

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Anthropic API error: ${res.status} - ${err.error?.message ?? "Unknown error"}`);
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
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                fullContent += parsed.delta.text;
                options.onStream(parsed.delta.text);
              }
            } catch {}
          }
        }
      }

      return { kind, title: `Generated ${this.getKindLabel(kind)}`, content: fullContent };
    }

    const data = await res.json();
    const content = data.content?.[0]?.text ?? "";

    return { kind, title: `Generated ${this.getKindLabel(kind)}`, content };
  }
}