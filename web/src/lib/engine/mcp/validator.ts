import { MCP_AUTH_MODES } from "./clients";
import type {
  InstalledMCPServer,
  MCPCategory,
  MCPCapability,
  MCPEnvVarSpec,
  MCPLogLevel,
  MCPTransport,
  ValidationIssue,
  ValidationResult,
  ValidationReport,
} from "./types";

/**
 * Resolve env-var spec for a given key from a server catalog entry.
 * Falls back gracefully when the env spec is not declared (custom servers).
 */
function specForKey(
  specs: readonly MCPEnvVarSpec[],
  key: string,
): MCPEnvVarSpec | undefined {
  return specs.find((spec) => spec.key === key);
}

/**
 * Validate a single installed server's configuration against its
 * catalog-derived env spec requirements and transport constraints.
 */
export function validateServer(
  server: InstalledMCPServer,
  envSpecs: readonly MCPEnvVarSpec[] = [],
  transportKnownInvalid?: (t: MCPTransport) => boolean,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Required identity fields.
  if (!server.name?.trim()) {
    issues.push({
      severity: "error",
      code: "MISSING_NAME",
      message: "Server name is required.",
      field: "name",
      suggestion: "Provide a display name for this server.",
    });
  }

  // Transport-specific required fields.
  if (server.transport === "stdio") {
    if (!server.command?.trim()) {
      issues.push({
        severity: "error",
        code: "MISSING_COMMAND",
        message: "stdio transport requires a command.",
        field: "command",
        suggestion: "Set the executable to spawn, e.g. `npx` or `uvx`.",
      });
    }
  } else if (server.transport === "http" || server.transport === "sse") {
    if (!server.url?.trim()) {
      issues.push({
        severity: "error",
        code: "MISSING_URL",
        message: `${server.transport} transport requires a URL.`,
        field: "url",
        suggestion: "Provide the remote endpoint, e.g. https://host/mcp",
      });
    } else {
      try {
        new URL(server.url);
      } catch {
        issues.push({
          severity: "error",
          code: "INVALID_URL",
          message: "URL is not a valid absolute URL.",
          field: "url",
          suggestion: "Include the scheme, e.g. https://",
        });
      }
      if (!server.url.startsWith("https://") && server.transport !== "sse") {
        issues.push({
          severity: "warning",
          code: "INSECURE_URL",
          message: "Non-HTTPS URL transmits secrets in clear text.",
          field: "url",
          suggestion: "Use https:// when providing API keys.",
        });
      }
    }
  } else {
    issues.push({
      severity: "error",
      code: "UNSUPPORTED_TRANSPORT",
      message: `Unsupported transport: ${String(server.transport)}`,
      field: "transport",
    });
  }

  // Optional: caller-supplied transport allowlist (e.g. client preferences).
  if (transportKnownInvalid && transportKnownInvalid(server.transport)) {
    issues.push({
      severity: "warning",
      code: "TRANSPORT_NOT_PREFERRED",
      message: `Transport "${server.transport}" is unusual for this client.`,
      field: "transport",
    });
  }

  // Auth-mode sanity for remote transports.
  if (server.transport !== "stdio") {
    const validAuth = MCP_AUTH_MODES.some(
      (mode) => mode.value === server.authMode,
    );
    if (server.authMode && !validAuth) {
      issues.push({
        severity: "error",
        code: "UNSUPPORTED_AUTH",
        message: `Unknown auth mode: ${String(server.authMode)}`,
        field: "authMode",
      });
    }
    if (server.authMode && server.authMode !== "none") {
      const hasAuthEnv = server.env.some((env) =>
        /token|key|secret|password/i.test(env.key),
      );
      if (!hasAuthEnv) {
        issues.push({
          severity: "warning",
          code: "AUTH_NO_SECRET",
          message: `Auth mode "${String(server.authMode)}" set but no credential env var found.`,
          field: "env",
          suggestion: "Add a TOKEN/KEY env var.",
        });
      }
    }
  }

  // Environment variables.
  const providedKeys = new Set(
    server.env.filter((env) => env.value.trim()).map((env) => env.key),
  );
  for (const spec of envSpecs) {
    if (spec.required && !providedKeys.has(spec.key)) {
      issues.push({
        severity: "error",
        code: "MISSING_ENV_VAR",
        message: `Missing required environment variable: ${spec.key}`,
        field: `env.${spec.key}`,
        suggestion: spec.hint
          ? `Obtain the value at ${spec.hint}.`
          : "Set this env var before enabling the server.",
      });
    }
  }
  for (const env of server.env) {
    const spec = specForKey(envSpecs, env.key);
    if (spec?.secret && env.value && env.value.length < 8) {
      issues.push({
        severity: "warning",
        code: "WEAK_SECRET",
        message: `${env.key} looks too short for a secret.`,
        field: `env.${env.key}`,
      });
    }
  }

  // Timeout bounds.
  if (server.timeoutMs !== undefined && server.timeoutMs < 0) {
    issues.push({
      severity: "error",
      code: "INVALID_TIMEOUT",
      message: "Timeout cannot be negative.",
      field: "timeoutMs",
    });
  }

  // Log-level enum.
  const validLogLevels: MCPLogLevel[] = ["debug", "info", "warn", "error", "silent"];
  if (!validLogLevels.includes(server.logLevel)) {
    issues.push({
      severity: "warning",
      code: "INVALID_LOG_LEVEL",
      message: `Unknown log level: ${String(server.logLevel)}`,
      field: "logLevel",
    });
  }

  return {
    instanceId: server.instanceId,
    serverName: server.name,
    issues,
    ok: !issues.some((issue) => issue.severity === "error"),
  };
}

/**
 * Validate a collection of servers and surface cross-server issues
 * such as duplicate names. `envSpecsByServerId` maps catalog
 * server id -> env specs (used to validate required env vars).
 */
export function validateCollection(
  servers: InstalledMCPServer[],
  envSpecsByServerId: Record<string, readonly MCPEnvVarSpec[]> = {},
  opts: {
    categories?: MCPCategory[];
    capabilities?: MCPCapability[];
  } = {},
): ValidationReport {
  const serverResults = servers.map((server) =>
    validateServer(server, envSpecsByServerId[server.serverId] ?? []),
  );

  const globalIssues: ValidationIssue[] = [];

  // Duplicate instance names.
  const seenNames = new Map<string, number>();
  for (const server of servers) {
    const key = server.name.toLowerCase();
    seenNames.set(key, (seenNames.get(key) ?? 0) + 1);
  }
  for (const [name, count] of seenNames) {
    if (count > 1) {
      globalIssues.push({
        severity: "warning",
        code: "DUPLICATE_NAME",
        message: `${count} servers share the name "${name}".`,
        suggestion: "Rename one of them; some clients reject duplicates.",
      });
    }
  }

  // Duplicate instanceIds (should never happen, but guard).
  const seenIds = new Set<string>();
  for (const server of servers) {
    if (seenIds.has(server.instanceId)) {
      globalIssues.push({
        severity: "error",
        code: "DUPLICATE_INSTANCE_ID",
        message: `Duplicate instance id detected: ${server.instanceId}`,
        field: "instanceId",
      });
    }
    seenIds.add(server.instanceId);
  }

  // Optional format-level checks.
  if (opts.categories) {
    const validCategoryIds = new Set(opts.categories.map((category) => category.id));
    for (const server of servers) {
      if (!validCategoryIds.has(server.category)) {
        serverResults
          .find((result) => result.instanceId === server.instanceId)
          ?.issues.push({
            severity: "warning",
            code: "UNKNOWN_CATEGORY",
            message: `Unknown category: ${server.category}`,
            field: "category",
          });
      }
    }
  }

  void opts.capabilities; // reserved for future cross-capability checks

  const counts = {
    errors: 0,
    warnings: 0,
    infos: 0,
  };
  for (const result of serverResults) {
    for (const issue of result.issues) {
      if (issue.severity === "error") counts.errors += 1;
      else if (issue.severity === "warning") counts.warnings += 1;
      else counts.infos += 1;
    }
  }
  for (const issue of globalIssues) {
    if (issue.severity === "error") counts.errors += 1;
    else if (issue.severity === "warning") counts.warnings += 1;
    else counts.infos += 1;
  }

  return {
    servers: serverResults,
    globalIssues,
    ok: counts.errors === 0,
    counts,
  };
}

/**
 * Validate a raw JSON string as a candidate client config file.
 * Returns an object either with parsed servers or with issues.
 */
export function validateImportedJson(
  raw: string,
): { ok: true; parsed: unknown } | { ok: false; issue: ValidationIssue } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      issue: {
        severity: "error",
        code: "INVALID_JSON",
        message: `Failed to parse JSON: ${msg}`,
        suggestion: "Ensure the file contains valid JSON.",
      },
    };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      ok: false,
      issue: {
        severity: "error",
        code: "INVALID_JSON_SHAPE",
        message: "Top-level JSON must be an object (record).",
        suggestion: "Wrap servers in an object, e.g. {\"mcpServers\": {}}.",
      },
    };
  }
  return { ok: true, parsed };
}