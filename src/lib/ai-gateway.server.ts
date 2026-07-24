import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Server-only helper. Do NOT import from client code.
 * Reads LOVABLE_API_KEY inside the caller (server function/route handler),
 * then hands it to this factory.
 */
export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}
