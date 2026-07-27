import type { GenerationContext, GenerationOptions, GenerationResult, ProviderConfig, GenerationOutputKind } from "./types";
import { BaseProvider } from "./base-provider";

export class OpenAIProvider extends BaseProvider {
  readonly id = "openai";
  readonly label = "OpenAI";
  readonly models = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"];
  readonly defaultModel = "gpt-4o";

  validateApiKey(apiKey: string): boolean {
    return apiKey.startsWith("sk-") && apiKey.length > 20;
  }

  async testConnection(apiKey: string, model?: string): Promise<boolean> {
    try {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
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
    if (!this.config) throw new Error("OpenAI provider not configured");

    const model = options?.model ?? this.config.model ?? this.defaultModel;
    const systemPrompt = this.buildSystemPrompt(ctx, kind);
    const userPrompt = this.buildUserPrompt(ctx, kind);

    const payload = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      stream: options?.stream ?? false,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
        ...(this.config.organizationId ? { "OpenAI-Organization": this.config.organizationId } : {}),
        ...(this.config.projectId ? { "OpenAI-Project": this.config.projectId } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${res.status} - ${err.error?.message ?? "Unknown error"}`);
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
              const delta = parsed.choices?.[0]?.delta?.content ?? "";
              if (delta) {
                fullContent += delta;
                options.onStream(delta);
              }
            } catch {}
          }
        }
      }

      return {
        kind,
        title: `Generated ${this.getKindLabel(kind)}`,
        content: fullContent,
      };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    return {
      kind,
      title: `Generated ${this.getKindLabel(kind)}`,
      content,
    };
  }
}