// Adapter genérico: delega para um provedor concreto (ex: openai.js)
const openai = require("./openai");

async function generateCampaignScript(campaignPayload) {
  // Monta prompt/base para a LLM
  const prompt = buildPrompt(campaignPayload);
  const llmResponse = await openai.callLLM(prompt, { maxTokens: 800 });
  // Interpretar resposta conforme formato esperado
  return llmResponse;
}

function buildPrompt(payload) {
  return `
Você é um redator e estrategista de marketing. Com base nas informações da campanha fornecida, gere um roteiro detalhado para a campanha.
Formato esperado: título, objetivo, público-alvo, mensagem principal, canais e cronograma (com fases e entregáveis), sugestões de criativos (textos, CTAs), KPIs e recomendações finais.

Informações da campanha:
Nome: ${payload.name}
Objetivo: ${payload.objective}
Público-alvo: ${JSON.stringify(payload.targetAudience)}
Budget: ${payload.budget || "não informado"}
Duração: ${payload.duration || "não informado"}
Canais: ${payload.channels.join(", ")}
Tom: ${payload.tone || "neutro"}
Contexto extra: ${payload.extraContext || "nenhum"}

Gere o roteiro em português, claro e estruturado.
  `.trim();
}

module.exports = { generateCampaignScript };
