// Adapter genérico: delega para um provedor concreto (ex: openai.js)
const openai = require("./openai");

async function generateCampaignScript(campaignPayload) {
  // Monta prompt/base para a LLM
  const prompt = buildPrompt(campaignPayload);
  try {
    const llmResponse = await openai.callLLM(prompt, { maxTokens: 800 });
    // Interpretar resposta conforme formato esperado
    return llmResponse;
  } catch (err) {
    // Fallback: retorna um roteiro padrão
    return fallbackScript(campaignPayload);
  }
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

function fallbackScript(payload) {
  return `Título: ${payload.name || "Campanha de Marketing"}
Objetivo: ${payload.objective || "Alcançar o público-alvo e gerar resultados."}
Público-alvo: ${payload.targetAudience ? JSON.stringify(payload.targetAudience) : "Não informado"}
Mensagem principal: Descubra os benefícios do nosso produto/serviço!
Canais: ${payload.channels ? payload.channels.join(", ") : "A definir"}
Cronograma:
- Semana 1: Planejamento e criação de peças
- Semana 2: Lançamento nas redes sociais e e-mail
- Semana 3: Monitoramento e ajustes
- Semana 4: Relatório de resultados
Sugestões de criativos: Imagens chamativas, textos curtos e objetivos, CTA: "Saiba mais"
KPIs: Alcance, cliques, leads gerados, conversões
Recomendações finais: Acompanhe os resultados diariamente e ajuste a estratégia conforme necessário.`;
}

module.exports = { generateCampaignScript };
