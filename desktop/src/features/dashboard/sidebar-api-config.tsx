"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Download } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { useToast } from "@providers/toaster-provider";
import { useProviderStore } from "@lib/provider-store";
import { AI_PROVIDERS } from "@constants/providers";
import type { ProviderId } from "@/shared/types/provider";

const apiKeySchema = z.object({
  providerId: z.custom<ProviderId>(
    (val): val is ProviderId => typeof val === "string" && val.length > 0,
    "Select a provider",
  ),
  apiKey: z
    .string()
    .min(4, "Enter a valid API key")
    .max(512, "API key is too long"),
  endpoint: z.string().optional(),
});

type ApiKeyForm = z.input<typeof apiKeySchema>;

/**
 * Sidebar footer â€” API Provider selector + key input + save button.
 *
 * Saves the key only to in-memory provider store (per Phase 6 plan keys
 * are encrypted at rest via `services/crypto`). This footer lives in the
 * sidebar slot and is self-contained: it owns its form state.
 */
export function SidebarApiConfig() {
  const {
    activeProviderId,
    setActiveProvider,
    setApiKey,
    hasApiKey,
  } = useProviderStore();
  const { toast } = useToast();

  const form = useForm<ApiKeyForm>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      providerId: activeProviderId,
      apiKey: "",
      endpoint: "",
    },
  });

  const onValid = (values: ApiKeyForm) => {
    setActiveProvider(values.providerId);
    setApiKey(values.providerId, values.apiKey);
    form.reset({
      providerId: values.providerId,
      apiKey: "",
      endpoint: values.endpoint ?? "",
    });
    toast({
      title: "Provider loaded",
      description: `Active provider set to ${providerLabel(values.providerId)}.`,
      variant: "success",
    });
  };

  function providerLabel(id: ProviderId): string {
    return AI_PROVIDERS.find((p) => p.id === id)?.label ?? id;
  }

  const selectedProviderId = useWatch({ control: form.control, name: "providerId" });
  const selectedProvider = AI_PROVIDERS.find((p) => p.id === selectedProviderId);

  return (
    <form
      onSubmit={form.handleSubmit(onValid)}
      className="flex flex-col gap-2"
    >
      <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
        API Provider
      </p>
      <Select
        value={selectedProviderId}
        onValueChange={(value) =>
          form.setValue("providerId", value as ProviderId, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger aria-label="API Provider">
          <SelectValue placeholder="Select provider" />
        </SelectTrigger>
        <SelectContent>
          {AI_PROVIDERS.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              {provider.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedProvider?.requiresApiKey ? (
        <>
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            autoComplete="off"
            placeholder={
              hasApiKey(selectedProvider.id) ? "â€¢â€¢â€¢â€¢ stored in session" : "sk-..."
            }
            {...form.register("apiKey")}
          />
          {form.formState.errors.apiKey ? (
            <p className="text-[10px] text-danger">
              {form.formState.errors.apiKey.message}
            </p>
          ) : null}
        </>
      ) : null}

      {selectedProvider?.defaultEndpoint ? (
        <>
          <Label htmlFor="endpoint">Endpoint</Label>
          <Input
            id="endpoint"
            type="url"
            placeholder={selectedProvider.defaultEndpoint}
            {...form.register("endpoint")}
          />
        </>
      ) : null}

      <Button type="submit" size="sm">
        <Download />
        Load
      </Button>
    </form>
  );
}

